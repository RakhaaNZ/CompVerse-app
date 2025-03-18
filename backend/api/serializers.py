from rest_framework import serializers
from .models import Competition, UserProfile, Registration, Team

# Serializer untuk Competition
class CompetitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Competition
        fields = '__all__'  # Menggunakan semua field dalam model

# Serializer untuk UserProfile
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'

# Serializer untuk Registration
class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Registration
        fields = '__all__'

# Serializer untuk Team
class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'
