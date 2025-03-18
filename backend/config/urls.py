"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
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
router.register(r'competitions', CompetitionViewSet)
router.register(r'users', UserProfileViewSet)
router.register(r'registrations', RegistrationViewSet)
router.register(r'teams', TeamViewSet)

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

