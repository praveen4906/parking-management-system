from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, ParkingLotViewSet, SlotViewSet, BookingViewSet, MyTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'lots', ParkingLotViewSet, basename='lots')
router.register(r'slots', SlotViewSet, basename='slots')
router.register(r'bookings', BookingViewSet, basename='bookings')

urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
]