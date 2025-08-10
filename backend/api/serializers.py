from rest_framework import serializers
from .models import Competition, UserProfile, Registration, Team, TeamInvite
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.core.exceptions import ObjectDoesNotExist
from django.utils import timezone

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
        username=validated_data['email'],
        email=validated_data['email'],
        password=validated_data['password'],
        first_name=validated_data['first_name'],
        last_name=validated_data['last_name']
        )
    
        full_name = f"{validated_data['first_name']} {validated_data['last_name']}"

        try:
            profile = UserProfile.objects.get(user=user)
        except ObjectDoesNotExist:
            UserProfile.objects.create(user=user, full_name=full_name)

        return user
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email has been registered.")
        return value
    
class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['username'] = serializers.CharField(required=False)
        self.fields['email'] = serializers.EmailField(required=True)

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        return token

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        from django.contrib.auth import authenticate, get_user_model
        
        if not email:
            raise serializers.ValidationError({"email": "Email is required."})

        User = get_user_model()
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError({"email": "Email not found."})

        user = authenticate(username=user.username, password=password)
        
        if not user:
            raise serializers.ValidationError({"password": "Incorrect password."})

        refresh = self.get_token(user)
        
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
    
class CompetitionSerializer(serializers.ModelSerializer):
    formatted_start_date = serializers.SerializerMethodField()
    formatted_end_date = serializers.SerializerMethodField()
    formatted_close_registration = serializers.SerializerMethodField()
    
    class Meta:
        model = Competition
        fields = '__all__'  

    def get_formatted_start_date(self, obj):
        return obj.start_date.strftime("%d %B %Y, %H:%M")

    def get_formatted_end_date(self, obj):
        return obj.end_date.strftime("%d %B %Y, %H:%M")

    def get_formatted_close_registration(self, obj):
        return obj.close_registration.strftime("%d %B %Y, %H:%M")

    def validate_title(self, value):
        if len(value) < 5:
            raise serializers.ValidationError("The Competition name must be at least 5 characters.")
        return value

    def validate_end_date(self, value):
        if value < timezone.now():
            raise serializers.ValidationError("The end date must be in the future.")
        return value

    def validate_close_registration(self, value):
        if value < timezone.now():
            raise serializers.ValidationError("Close registration date must be in the future.")
        return value
    
    def validate_max_participants(self, value):
        if value <= 0:
            raise serializers.ValidationError("The number of participants must be more than 0!")
        return value

class UserProfileSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = UserProfile
        fields = [
            'id',
            'first_name',
            'last_name',
            'email',
            'full_name',
            'bio',
            'gender',
            'age',
            'location',
            'field_of_study',
            'institution_company',
            'profile_picture'
        ]
        
class TeamSerializer(serializers.ModelSerializer):
    competition = CompetitionSerializer()
    leader = UserSerializer()
    members = UserSerializer(many=True)
    class Meta:
        model = Team
        fields = '__all__'
        
    def validate_name(self, value):
        if Team.objects.filter(name=value).exists():
            raise serializers.ValidationError("The team name is already in use.")
        return value

class RegistrationSerializer(serializers.ModelSerializer):
    competition = CompetitionSerializer(read_only=True)
    team = TeamSerializer(read_only=True)
    class Meta:
        model = Registration
        fields = ["competition", "team", "registered_at"]
        read_only_fields = ["registered_at"]

        competition_id = serializers.IntegerField(write_only=True)
        team_id = serializers.IntegerField(write_only=True)

    def create(self, validated_data):
        competition_id = validated_data.pop("competition_id")
        team_id = validated_data.pop("team_id")

        competition = Competition.objects.get(id=competition_id)
        team = Team.objects.get(id=team_id)

        if team.competition_id != competition.id:
            raise serializers.ValidationError("Team does not belong to this competition.")

        registration, created = Registration.objects.get_or_create(
            competition=competition,
            team=team
        )
        return registration
    
class TeamInviteSerializer(serializers.ModelSerializer):
    invited_by_name = serializers.CharField(source="invited_by.username", read_only=True)
    team_name = serializers.CharField(source="team.name", read_only=True)

    class Meta:
        model = TeamInvite
        fields = ["id", "team", "team_name", "email", "invited_by", "invited_by_name", "accepted", "created_at"]
        read_only_fields = ["accepted", "created_at", "invited_by"]

    def create(self, validated_data):
        request = self.context.get("request")
        validated_data["invited_by"] = request.user
        return super().create(validated_data)
    
class TeamMemberSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    profile_picture = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'email', 'full_name', 'profile_picture']

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

    def get_profile_picture(self, obj):
        try:
            return obj.userprofile.profile_picture
        except UserProfile.DoesNotExist:
            return None

class TeamDetailSerializer(TeamSerializer):
    members = TeamMemberSerializer(many=True, read_only=True)
    leader = TeamMemberSerializer(read_only=True)
    competition = CompetitionSerializer(read_only=True)

class JoinTeamSerializer(serializers.Serializer):
    team_id = serializers.IntegerField()

    def validate_team_id(self, value):
        try:
            team = Team.objects.get(id=value)
        except Team.DoesNotExist:
            raise serializers.ValidationError("Team not found.")
        return value
    
class ParticipantSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'full_name', 'email']

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"
