app.conf.beat_schedule = {
    'update-competition-status': {
        'task': 'api.tasks.update_competition_status',
        'schedule': 3600.0,
    },
}