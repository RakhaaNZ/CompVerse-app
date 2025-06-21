from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from datetime import timedelta

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created and not hasattr(instance, 'userprofile'):
        UserProfile.objects.create(user=instance, full_name=f"{instance.first_name} {instance.last_name}")

class Competition(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    close_registration = models.DateTimeField(
        default=timezone.now() + timedelta(days=7) 
    )
    max_participants = models.IntegerField()
    is_team_based = models.BooleanField(default=False)
    poster_competition = models.URLField(max_length=500, blank=True, null=True)
    
    COMPETITION_TYPES = [
        ('Individual', 'Individual'),
        ('Team', 'Team'),
    ]
    
    CATEGORY_CHOICES = [
        ('Technology', 'Technology'),
        ('Business', 'Business'),
        ('Art', 'Art & Design'),
        ('Science', 'Science'),
        ('other', 'Other'),
    ]
    
    category = models.CharField(
        max_length=20, 
        choices=CATEGORY_CHOICES, 
        default='Technology'
    )
    
    STATUS_CHOICES = [
        ('Open', 'Open'),
        ('Closed', 'Closed'),
    ]

    type = models.CharField(max_length=20, choices=COMPETITION_TYPES, default='Individual')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Open')
    
    def save(self, *args, **kwargs):
        if self.close_registration and timezone.now() > self.close_registration:
            self.status = 'Closed'
        super().save(*args, **kwargs)
        
    @property
    def is_registration_open(self):
        return self.status == 'Open' and timezone.now() <= self.close_registration

    def __str__(self):
        return self.title

class UserProfile(models.Model):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female')
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=255)
    bio = models.TextField(blank=True, null=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=True, null=True)
    age = models.PositiveIntegerField(blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    field_of_study = models.CharField(max_length=100, blank=True, null=True)
    institution_company = models.CharField(max_length=100, blank=True, null=True)
    profile_picture = models.URLField(max_length=500, blank=True, null=True)

    def __str__(self):
        return self.full_name


class Registration(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    competition = models.ForeignKey(Competition, on_delete=models.CASCADE)
    registered_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.competition.title}"


class Team(models.Model):
    name = models.CharField(max_length=255, unique=True)
    competition = models.ForeignKey(Competition, on_delete=models.CASCADE, related_name="teams")
    leader = models.ForeignKey(User, on_delete=models.CASCADE, related_name="led_teams", null=True, blank=True)  
    members = models.ManyToManyField(User, related_name="joined_teams") 
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.competition.title}"

