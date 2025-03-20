from rest_framework import serializers
from .models import Competition, UserProfile, Registration, Team
from django.contrib.auth.models import User
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

# Serializer untuk Competition
class CompetitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Competition
        fields = '__all__'  # Menggunakan semua field dalam model
        
    def validate_name(self, value):
        if len(value) < 5:
            raise serializers.ValidationError("Nama lomba harus minimal 5 karakter.")
        return value

    def validate_deadline(self, value):
        from datetime import date
        if value < date.today():
            raise serializers.ValidationError("Deadline harus di masa depan.")
        return value
    
    def validate_max_participants(self, value):
        if value <= 0:
            raise serializers.ValidationError("Jumlah peserta harus lebih dari 0!")
        return value

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
    members = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), many=True)
    class Meta:
        model = Team
        fields = '__all__'

class JoinTeamSerializer(serializers.Serializer):
    team_id = serializers.IntegerField()

    def validate_team_id(self, value):
        try:
            team = Team.objects.get(id=value)
        except Team.DoesNotExist:
            raise serializers.ValidationError("Team not found.")
        return value