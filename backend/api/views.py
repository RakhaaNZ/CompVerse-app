from django.shortcuts import render
from rest_framework import viewsets, permissions, generics,status
from .models import Competition, UserProfile, Registration, Team
from .serializers import CompetitionSerializer, UserProfileSerializer, RegistrationSerializer, TeamSerializer, UserSerializer, JoinTeamSerializer, ParticipantSerializer, EmailTokenObtainPairSerializer
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

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

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

        if Registration.objects.filter(user=user, competition_id=competition_id).exists():
            return Response({"error": "You are already registered for this competition!"}, status=status.HTTP_400_BAD_REQUEST)

        return super().create(request, *args, **kwargs)

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

        if team.members.filter(id=user.id).exists():
            return Response({'detail': 'Anda sudah tergabung dalam tim ini.'}, status=status.HTTP_400_BAD_REQUEST)

        max_participants = team.competition.max_participants
        if team.members.count() >= max_participants:
            return Response({"error": "Tim sudah mencapai batas maksimal anggota!"}, status=status.HTTP_400_BAD_REQUEST)

        team.members.add(user)
        return Response({'detail': 'Berhasil bergabung ke tim!'}, status=status.HTTP_200_OK)


class RegisterCompetitionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        """
        Note:
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

        if Registration.objects.filter(user=user, competition=competition).exists():
            return Response({"error": "You are already registered for this competition."}, status=status.HTTP_400_BAD_REQUEST)

        if competition.type == "individual":
            Registration.objects.create(user=user, competition=competition)
            return Response({"message": "Successfully registered for the competition."}, status=status.HTTP_201_CREATED)

        if competition.type == "group":
            if not team_id:
                return Response({"error": "Team ID is required for group competitions."}, status=status.HTTP_400_BAD_REQUEST)

            try:
                team = Team.objects.get(id=team_id)
            except Team.DoesNotExist:
                return Response({"error": "Team not found"}, status=status.HTTP_404_NOT_FOUND)

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