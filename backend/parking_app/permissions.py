from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    ParkingLot owner can edit; others read-only.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return hasattr(request.user, 'id') and obj.owner_id == request.user.id

class IsParkingOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.role == 'owner'