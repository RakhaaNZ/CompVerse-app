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

# Router untuk API
router = DefaultRouter()
router.register(r'competitions', CompetitionViewSet, basename='competition')
router.register(r'users', UserProfileViewSet)
router.register(r'registrations', RegistrationViewSet, basename='registration')
router.register(r'teams', TeamViewSet, basename='team')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/register/', RegisterUserView.as_view(), name='register'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('api/competitions/register/', RegisterCompetitionView.as_view(), name='register_competition'),
    path('api/teams/create/', CreateTeamView.as_view(), name='create_team'),
    path('api/teams/join/', JoinTeamView.as_view(), name='join_team'),
]