from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True  # Semua user bisa melihat daftar lomba
        return request.user and request.user.is_staff  # Hanya admin yang bisa mengelola lomba
