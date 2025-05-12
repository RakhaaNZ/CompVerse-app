from celery import shared_task
from django.utils import timezone
from .models import Competition

@shared_task
def update_competition_status():
    Competition.objects.filter(
        status='Open',
        close_registration__lte=timezone.now()
    ).update(status='Closed')