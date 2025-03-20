from rest_framework import serializers
from .models import Competition, UserProfile, Registration, Team
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class CompetitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Competition
        fields = '__all__'  

    def validate_title(self, value):
        if len(value) < 5:
            raise serializers.ValidationError("The Competition name must be at least 5 characters.")
        return value

    def validate_end_date(self, value):
        from datetime import datetime
        if value < datetime.now():
            raise serializers.ValidationError("The end date must be in the future.")
        return value
    
    def validate_max_participants(self, value):
        if value <= 0:
            raise serializers.ValidationError("The number of participants must be more than 0!")
        return value

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'

class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Registration
        fields = '__all__'

class TeamSerializer(serializers.ModelSerializer):
    members = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), many=True)
    class Meta:
        model = Team
        fields = '__all__'
        
    def validate_name(self, value):
        if Team.objects.filter(name=value).exists():
            raise serializers.ValidationError("The team name is already in use.")
        return value

class JoinTeamSerializer(serializers.Serializer):
    team_id = serializers.IntegerField()

    def validate_team_id(self, value):
        try:
            team = Team.objects.get(id=value)
        except Team.DoesNotExist:
            raise serializers.ValidationError("Team not found.")
        return value
    
# Serializer untuk peserta
class ParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'name', 'email']