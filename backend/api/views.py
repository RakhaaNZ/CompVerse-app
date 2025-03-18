from django.shortcuts import render
from rest_framework import viewsets
from .models import Competition, UserProfile, Registration, Team
from .serializers import CompetitionSerializer, UserProfileSerializer, RegistrationSerializer, TeamSerializer

# ViewSet untuk Competition
class CompetitionViewSet(viewsets.ModelViewSet):
    queryset = Competition.objects.all()
    serializer_class = CompetitionSerializer

# ViewSet untuk UserProfile
class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

# ViewSet untuk Registration
class RegistrationViewSet(viewsets.ModelViewSet):
    queryset = Registration.objects.all()
    serializer_class = RegistrationSerializer

# ViewSet untuk Team
class TeamViewSet(viewsets.ModelViewSet):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
