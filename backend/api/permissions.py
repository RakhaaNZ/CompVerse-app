from rest_framework.permissions import BasePermission

class IsAdminOrReadOnly(BasePermission):
    """
    - Admin bisa melakukan semua operasi (GET, POST, PUT, DELETE).
    - User biasa hanya bisa melakukan GET (melihat data).
    """
    def has_permission(self, request, view):
        if request.method in ['GET']:  # Semua user bisa melihat data
            return True
        return request.user.is_staff  # Hanya admin yang bisa mengedit
