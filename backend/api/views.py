from django.shortcuts import render
from rest_framework import viewsets, permissions, generics,status
from .models import Competition, UserProfile, Registration, Team, TeamInvite
from .serializers import CompetitionSerializer, UserProfileSerializer, RegistrationSerializer, TeamSerializer, UserSerializer, TeamInviteSerializer, JoinTeamSerializer, ParticipantSerializer, EmailTokenObtainPairSerializer
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from .permissions import IsAdminOrReadOnly
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.decorators import action, api_view, permission_classes
from django.shortcuts import get_object_or_404
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.parsers import MultiPartParser
import uuid
from datetime import datetime
from supabase import create_client, Client
import os
from django.db import models

class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer

class RegisterUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {"message": "User registered successfully!", "user_id": user.id},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CompetitionViewSet(viewsets.ModelViewSet):
    queryset = Competition.objects.all()
    serializer_class = CompetitionSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['type', 'status']
    search_fields = ['title', 'description'] 
    ordering_fields = ['end_date', 'start_date']

    @action(detail=True, methods=['get'], url_path='participants')
    def competition_participants(self, request, pk=None):
        """Menampilkan daftar peserta di lomba tertentu"""
        competition = get_object_or_404(Competition, id=pk)
        participants = User.objects.filter(registration__competition=competition) 
        serializer = ParticipantSerializer(participants, many=True)
        return Response({
            "competition_id": competition.id,
            "competition_title": competition.title,
            "participants": serializer.data
        })
        
    @action(detail=True, methods=['get'])
    def teams(self, request, pk=None):
        """Menampilkan daftar tim dalam kompetisi tertentu"""
        competition = get_object_or_404(Competition, id=pk)
        teams = Team.objects.filter(competition=competition)
        serializer = TeamSerializer(teams, many=True)
        return Response(serializer.data)
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
            
        comp_type = self.request.query_params.get('type')
        if comp_type:
            queryset = queryset.filter(type=comp_type)
            
        return queryset

supabase: Client = create_client(
    os.getenv('SUPABASE_URL'),
    os.getenv('SUPABASE_KEY')
)

class UploadCompetitionPosterView(APIView):
    parser_classes = [MultiPartParser]
    permission_classes = [IsAdminUser]

    def post(self, request, competition_id):
        competition = get_object_or_404(Competition, id=competition_id)
        
        if 'poster' not in request.FILES:
            return Response({"error": "No poster file provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        poster_file = request.FILES['poster']
        file_extension = os.path.splitext(poster_file.name)[1]
        unique_filename = f"competition_{competition_id}_{uuid.uuid4()}{file_extension}"
        
        try:
            res = supabase.storage.from_("competition-posters").upload(
                file=poster_file,
                path=unique_filename,
                file_options={"content-type": poster_file.content_type}
            )
            
            poster_url = supabase.storage.from_("competition-posters").get_public_url(unique_filename)
            
            competition.poster_competition = poster_url
            competition.save()
            
            return Response({
                "message": "Poster uploaded successfully",
                "poster_url": poster_url
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class RegistrationViewSet(viewsets.ModelViewSet):
    queryset = Registration.objects.all()
    serializer_class = RegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['competition', 'user']
    ordering_fields = ['registered_at']

    def create(self, request, *args, **kwargs):
        user = request.user
        competition_id = request.data.get("competition_id")
        team_id = request.data.get("team_id")

        # Cek competition
        try:
            competition = Competition.objects.get(id=competition_id)
        except Competition.DoesNotExist:
            return Response({"error": "Competition not found"}, status=status.HTTP_404_NOT_FOUND)

        # Cek sudah terdaftar atau belum
        if Registration.objects.filter(competition=competition, user=user).exists():
            return Response({"error": "You are already registered for this competition"},
                            status=status.HTTP_400_BAD_REQUEST)

        # Kalau team-based
        if competition.is_team_based:
            if not team_id:
                return Response({"error": "Team ID is required for team-based competitions"},
                                status=status.HTTP_400_BAD_REQUEST)
            try:
                team = Team.objects.get(id=team_id, competition=competition)
            except Team.DoesNotExist:
                return Response({"error": "Team not found for this competition"},
                                status=status.HTTP_404_NOT_FOUND)

            if not team.members.filter(id=user.id).exists():
                return Response({"error": "You must be a member of the team to register"},
                                status=status.HTTP_400_BAD_REQUEST)

            registration = Registration.objects.create(
                competition=competition,
                user=user,
                team=team
            )
        else:
            registration = Registration.objects.create(
                competition=competition,
                user=user
            )

        serializer = self.get_serializer(registration)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['competition', 'is_looking_for_members']
    search_fields = ['name']
    ordering_fields = ['created_at']

    def create(self, request, *args, **kwargs):
        user = request.user
        team_name = request.data.get("team_name")
        competition_id = request.data.get("competition_id")

        if not team_name or not competition_id:
            return Response({"error": "team_name and competition_id are required."},
                            status=status.HTTP_400_BAD_REQUEST)

        if Team.objects.filter(name=team_name).exists():
            return Response({"error": "Team name already exists."},
                            status=status.HTTP_400_BAD_REQUEST)

        try:
            competition = Competition.objects.get(id=competition_id)
        except Competition.DoesNotExist:
            return Response({"error": "Competition not found."},
                            status=status.HTTP_404_NOT_FOUND)

        team = Team.objects.create(
            name=team_name,
            leader=user,
            competition=competition
        )
        team.members.add(user)

        return Response({
            "message": "Team created successfully.",
            "team_id": team.id
        }, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='join')
    def join_team(self, request, pk=None):
        team = self.get_object()
        user = request.user

        # Cek apakah user sudah menjadi anggota tim
        if team.members.filter(id=user.id).exists():
            return Response(
                {'detail': 'Anda sudah tergabung dalam tim ini.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Cek apakah tim masih menerima anggota
        if not team.is_looking_for_members:
            return Response(
                {"error": "Tim ini sudah tidak menerima anggota baru"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Cek batas maksimal anggota
        max_participants = team.competition.max_participants
        if team.members.count() >= max_participants:
            return Response(
                {"error": "Tim sudah mencapai batas maksimal anggota!"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Tambahkan user ke tim
        team.members.add(user)

        # Buat registrasi kompetisi untuk user
        Registration.objects.get_or_create(
            competition=team.competition,
            user=user,
            team=team
        )

        return Response(
            {'detail': 'Berhasil bergabung ke tim dan terdaftar di kompetisi!'},
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['post'], url_path='add-member')
    def add_member(self, request, pk=None):
        """
        Endpoint untuk menambahkan member ke tim (hanya leader)
        """
        team = self.get_object()
        user = request.user
        
        
        
        # Cek apakah user adalah leader tim
        if request.user.id != team.leader.id:
            return Response(
                {"error": "Only team leader can add members"},
                status=status.HTTP_403_FORBIDDEN
            )
        
        email = request.data.get("email")
        if not email:
            return Response(
                {"error": "Email is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user_to_add = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"error": "User with this email does not exist"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Cek apakah user sudah menjadi member
        if team.members.filter(id=user_to_add.id).exists():
            return Response(
                {"error": "User is already a member of this team"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Cek batas maksimal member
        max_participants = team.competition.max_participants
        if team.members.count() >= max_participants:
            return Response(
                {"error": "Team has reached maximum members limit"},
                status=status.HTTP_400_BAD_REQUEST
            )

        team.members.add(user_to_add)
        return Response(
            {"success": "Member added successfully"},
            status=status.HTTP_200_OK
        )
        
        # Daftarkan member ke competition
        registration, created = Registration.objects.get_or_create(
            competition=team.competition,
            user=user_to_add,
            defaults={'team': team}
        )
        
        if not created:
            registration.team = team
            registration.save()

        return Response(
            {
                "success": "Member added and registered to competition successfully",
                "registration_id": registration.id
            },
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['delete'], url_path='remove-member/(?P<member_id>[^/.]+)')
    def remove_member(self, request, pk=None, member_id=None):
        """
        Endpoint untuk menghapus member dari tim (hanya leader)
        """
        team = self.get_object()
        user = request.user
        
        # Cek apakah user adalah leader tim
        if team.leader != user:
            return Response(
                {"error": "Only team leader can remove members"},
                status=status.HTTP_403_FORBIDDEN
            )

        try:
            member = User.objects.get(id=member_id)
        except User.DoesNotExist:
            return Response(
                {"error": "Member not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        # Cek apakah user adalah member tim
        if not team.members.filter(id=member_id).exists():
            return Response(
                {"error": "User is not a member of this team"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Leader tidak bisa menghapus diri sendiri
        if member_id == user.id:
            return Response(
                {"error": "Leader cannot remove themselves from the team"},
                status=status.HTTP_400_BAD_REQUEST
            )

        team.members.remove(member)
        return Response(
            {"success": "Member removed successfully"},
            status=status.HTTP_200_OK
        )
        
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def members(self, request, pk=None):
        """
        Endpoint untuk mendapatkan daftar member tim
        """
        team = self.get_object()
        members = team.members.all()
        serializer = UserSerializer(members, many=True)
        return Response(serializer.data)
    
class TeamInviteViewSet(viewsets.ModelViewSet):
    queryset = TeamInvite.objects.all()
    serializer_class = TeamInviteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TeamInvite.objects.filter(email=self.request.user.email)

    @action(detail=True, methods=["post"])
    def accept(self, request, pk=None):
        invite = self.get_object()
        if invite.accepted:
            return Response({"detail": "Already accepted"}, status=status.HTTP_400_BAD_REQUEST)

        invite.accepted = True
        invite.save()

        invite.team.members.add(request.user)
        return Response({"detail": "Invite accepted and added to team"})


class RegisterCompetitionView(APIView):
    permission_classes = [permissions.IsAuthenticated] 

    def post(self, request):
        competition_id = request.data.get("competition_id")
        team_id = request.data.get("team_id")

        if not competition_id or not team_id:
            return Response({"error": "competition_id and team_id are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            competition = Competition.objects.get(id=competition_id)
        except Competition.DoesNotExist:
            return Response({"error": "Competition not found."}, status=status.HTTP_404_NOT_FOUND)

        try:
            team = Team.objects.get(id=team_id)
        except Team.DoesNotExist:
            return Response({"error": "Team not found."}, status=status.HTTP_404_NOT_FOUND)

        # Pastikan user adalah leader tim
        if team.leader != request.user:
            return Response({"error": "You are not the leader of this team."}, status=status.HTTP_403_FORBIDDEN)

        # Pastikan tim ikut kompetisi yang sama
        if team.competition_id != competition.id:
            return Response({"error": "Team is not for this competition."}, status=status.HTTP_400_BAD_REQUEST)

        return Response({
            "message": "Team successfully registered for competition",
            "competition": competition.id,
            "team": team.id
        }, status=status.HTTP_201_CREATED)
      
      
class CreateTeamView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        """
        Endpoint untuk membuat tim baru.
        """
        user = request.user
        team_name = request.data.get("team_name")

        if Team.objects.filter(name=team_name).exists():
            return Response({"error": "Team name already exists."}, status=status.HTTP_400_BAD_REQUEST)

        competition_id = request.data.get("competition_id")
        try:
            competition = Competition.objects.get(id=competition_id)
        except Competition.DoesNotExist:
            return Response({"error": "Competition not found."}, status=status.HTTP_404_NOT_FOUND)

        team = Team.objects.create(name=team_name, leader=user, competition=competition)

        team.members.add(user)
        return Response({"message": "Team created successfully.", "team_id": team.id}, status=status.HTTP_201_CREATED)


class JoinTeamView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        """Endpoint untuk bergabung ke tim."""
        user = request.user
        team_id = request.data.get("team_id")

        try:
            team = Team.objects.get(id=team_id)
        except Team.DoesNotExist:
            return Response({"error": "Tim tidak ditemukan."}, status=status.HTTP_404_NOT_FOUND)

        if Team.objects.filter(members=user, competition=team.competition).exists():
            return Response({"error": "Anda sudah tergabung dalam tim lain dalam kompetisi ini."}, status=status.HTTP_400_BAD_REQUEST)

        team.members.add(user)
        return Response({"message": "Berhasil bergabung ke tim."}, status=status.HTTP_200_OK)
    
class MyCompetitionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Dapatkan kompetisi dimana user terdaftar secara langsung
        direct_registrations = Registration.objects.filter(user=request.user)
        
        # Dapatkan kompetisi dimana user terdaftar melalui tim
        team_registrations = Registration.objects.filter(team__members=request.user)
        
        # Gabungkan dan ambil kompetisi unik
        all_registrations = (direct_registrations | team_registrations).distinct()
        competitions = [r.competition for r in all_registrations]
        
        serializer = CompetitionSerializer(competitions, many=True)
        return Response(serializer.data)
    
class MyTeamsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        led_teams = Team.objects.filter(leader=user)
        joined_teams = Team.objects.filter(members=user).exclude(leader=user)

        all_teams = led_teams.union(joined_teams)

        serializer = TeamSerializer(all_teams, many=True)
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_dashboard(request):
    """Menampilkan statistik pendaftaran dan jumlah tim untuk admin"""
    total_competitions = Competition.objects.count()
    total_users = User.objects.count()
    total_teams = Team.objects.count()
    total_registrations = Registration.objects.count()

    data = {
        "total_competitions": total_competitions,
        "total_users": total_users,
        "total_teams": total_teams,
        "total_registrations": total_registrations,
    }
    return Response(data)