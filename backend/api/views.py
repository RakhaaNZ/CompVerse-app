from django.shortcuts import render
from rest_framework import viewsets, permissions, generics,status
from .models import Competition, UserProfile, Registration, Team
from .serializers import CompetitionSerializer, UserProfileSerializer, RegistrationSerializer, TeamSerializer, UserSerializer, JoinTeamSerializer, ParticipantSerializer
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from .permissions import IsAdminOrReadOnly
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.decorators import action, api_view, permission_classes
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError

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

# ViewSet untuk Competition
class CompetitionViewSet(viewsets.ModelViewSet):
    queryset = Competition.objects.all()
    serializer_class = CompetitionSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['type', 'status']
    search_fields = ['name', 'description'] 
    ordering_fields = ['deadline', 'created_at']
    
    @action(detail=True, methods=['get'], url_path='participants')
    def competition_participants(self, request, pk=None):
        competition = get_object_or_404(Competition, id=pk)
        participants = competition.participants.all()  # Asumsikan ada relasi ManyToMany ke User
        serializer = ParticipantSerializer(participants, many=True)
        return Response({
            "competition_id": competition.id,
            "competition_name": competition.name,
            "participants": serializer.data
        })
        
    @action(detail=True, methods=['get'])
    def teams(self, request, pk=None):
        """Menampilkan daftar tim dalam kompetisi tertentu"""
        competition = get_object_or_404(Competition, id=pk)
        teams = Team.objects.filter(competition=competition)
        serializer = TeamSerializer(teams, many=True)
        return Response(serializer.data)

# ViewSet untuk UserProfile
class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

# ViewSet untuk Registration
class RegistrationViewSet(viewsets.ModelViewSet):
    queryset = Registration.objects.all()
    serializer_class = RegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['competition', 'user']
    ordering_fields = ['registered_at']

    def create(self, request, *args, **kwargs):
        user = request.user
        competition_id = request.data.get("competition")

        # Cek apakah user sudah mendaftar kompetisi ini
        if Registration.objects.filter(user=user, competition_id=competition_id).exists():
            return Response({"error": "Anda sudah terdaftar dalam kompetisi ini!"}, status=status.HTTP_400_BAD_REQUEST)

        return super().create(request, *args, **kwargs)

# ViewSet untuk Team
class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticated] 
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['competition']
    search_fields = ['name']
    ordering_fields = ['created_at']
    
    @action(detail=True, methods=['post'], url_path='join')
    def join_team(self, request, pk=None):
        """Endpoint untuk user bergabung ke tim"""
        team = self.get_object()
        user = request.user

        if user in team.members.all():
            return Response({'detail': 'You are already in this team.'}, status=status.HTTP_400_BAD_REQUEST)

        team.members.add(user)
        return Response({'detail': 'Successfully joined the team!'}, status=status.HTTP_200_OK)
    
    def join_teams(user, team):
        if user.team is not None:
            raise ValidationError("Anda sudah tergabung dalam tim lain.")
        team.members.add(user)
    
    def add_member(self, request, team_id):
        team = get_object_or_404(Team, id=team_id)
        user = request.user

        # Cek apakah tim sudah penuh
        max_participants = team.competition.max_participants
        if team.members.count() >= max_participants:
            return Response({"error": "Tim sudah mencapai batas maksimal anggota!"}, status=status.HTTP_400_BAD_REQUEST)

        # Tambahkan user ke tim
        team.members.add(user)
        return Response({"message": "Berhasil bergabung ke tim!"}, status=status.HTTP_200_OK)

class RegisterCompetitionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        """
        Endpoint untuk user mendaftar lomba.
        Jika lomba tipe 'individual', langsung daftar.
        Jika lomba tipe 'group', user harus masuk tim dulu.
        """
        user = request.user
        competition_id = request.data.get("competition_id")
        team_id = request.data.get("team_id", None)

        try:
            competition = Competition.objects.get(id=competition_id)
        except Competition.DoesNotExist:
            return Response({"error": "Competition not found"}, status=status.HTTP_404_NOT_FOUND)

        # Cek apakah user sudah terdaftar di lomba ini
        if Registration.objects.filter(user=user, competition=competition).exists():
            return Response({"error": "You are already registered for this competition."}, status=status.HTTP_400_BAD_REQUEST)

        # Jika lomba tipe individual, langsung daftar
        if competition.type == "individual":
            Registration.objects.create(user=user, competition=competition)
            return Response({"message": "Successfully registered for the competition."}, status=status.HTTP_201_CREATED)

        # Jika lomba tipe group, user harus masuk tim dulu
        if competition.type == "group":
            if not team_id:
                return Response({"error": "Team ID is required for group competitions."}, status=status.HTTP_400_BAD_REQUEST)

            try:
                team = Team.objects.get(id=team_id)
            except Team.DoesNotExist:
                return Response({"error": "Team not found"}, status=status.HTTP_404_NOT_FOUND)

            # Cek apakah user sudah ada di tim
            if team.members.filter(id=user.id).exists():
                Registration.objects.create(user=user, competition=competition, team=team)
                return Response({"message": "Successfully registered with the team."}, status=status.HTTP_201_CREATED)
            else:
                return Response({"error": "You are not a member of this team."}, status=status.HTTP_400_BAD_REQUEST)

        return Response({"error": "Invalid request."}, status=status.HTTP_400_BAD_REQUEST)
      
      
class CreateTeamView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        """
        Endpoint untuk membuat tim baru.
        """
        user = request.user
        team_name = request.data.get("team_name")

        if Team.objects.filter(name=team_name).exists():
            return Response({"error": "Team name already exists."}, status=status.HTTP_400_BAD_REQUEST)

        team = Team.objects.create(name=team_name, leader=user)
        team.members.add(user)  # Pemimpin tim otomatis masuk ke tim
        return Response({"message": "Team created successfully.", "team_id": team.id}, status=status.HTTP_201_CREATED)


class JoinTeamView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        """
        Endpoint untuk bergabung ke tim.
        """
        user = request.user
        team_id = request.data.get("team_id")

        try:
            team = Team.objects.get(id=team_id)
        except Team.DoesNotExist:
            return Response({"error": "Team not found"}, status=status.HTTP_404_NOT_FOUND)

        # Cek apakah user sudah di dalam tim
        if team.members.filter(id=user.id).exists():
            return Response({"error": "You are already a member of this team."}, status=status.HTTP_400_BAD_REQUEST)

        team.members.add(user)
        return Response({"message": "Successfully joined the team."}, status=status.HTTP_200_OK)

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