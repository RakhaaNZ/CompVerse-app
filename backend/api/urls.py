from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import (
    CompetitionViewSet, UserProfileViewSet, RegistrationViewSet, TeamViewSet, RegisterUserView, RegisterCompetitionView, CreateTeamView, JoinTeamView
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

# Router for API
router = DefaultRouter()
router.register(r'competitions', CompetitionViewSet, basename='competition')
router.register(r'users', UserProfileViewSet)
router.register(r'registrations', RegistrationViewSet, basename='registration')
router.register(r'teams', TeamViewSet, basename='team')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', RegisterUserView.as_view(), name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('competitions/register/', RegisterCompetitionView.as_view(), name='register_competition'),
    path('teams/create/', CreateTeamView.as_view(), name='create_team'),
    path('teams/join/', JoinTeamView.as_view(), name='join_team'),
]