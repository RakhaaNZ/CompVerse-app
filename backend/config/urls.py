from django.contrib import admin
from django.urls import path, include
from api.views import admin_dashboard

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('custom-admin/dashboard/', admin_dashboard, name='admin-dashboard'),
]
