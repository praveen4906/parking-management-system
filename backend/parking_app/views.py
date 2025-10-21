from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from .models import User, ParkingLot, Slot, Booking
from .serializers import UserSerializer, ParkingLotSerializer, SlotSerializer, BookingSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from .permissions import IsOwnerOrReadOnly, IsParkingOwner
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.shortcuts import get_object_or_404
from django.db import transaction

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['role'] = user.role
        token['username'] = user.username
        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]  # registration allowed

    def get_permissions(self):
        if self.action in ['create']:
            return [AllowAny()]
        return [IsAuthenticated()]

class ParkingLotViewSet(viewsets.ModelViewSet):
    queryset = ParkingLot.objects.all().select_related('owner')
    serializer_class = ParkingLotSerializer
    permission_classes = [IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
        # create slots as per total_slots
        total = serializer.validated_data.get('total_slots', 0)
        lot = serializer.instance
        for i in range(1, total + 1):
            Slot.objects.create(lot=lot, number=i)

    def get_queryset(self):
        qs = super().get_queryset()
        return qs

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def mine(self, request):
        qs = self.get_queryset().filter(owner=request.user)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

class SlotViewSet(viewsets.ModelViewSet):
    queryset = Slot.objects.all().select_related('lot')
    serializer_class = SlotSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = super().get_queryset()
        lot_id = self.request.query_params.get('lot')
        if lot_id:
            qs = qs.filter(lot_id=lot_id)
        return qs

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all().select_related('driver','slot')
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'owner':
            # show bookings for owner's lots
            return Booking.objects.filter(slot__lot__owner=user)
        return Booking.objects.filter(driver=user)

    @transaction.atomic
    def perform_create(self, serializer):
        slot = get_object_or_404(Slot, pk=serializer.validated_data['slot'].id if isinstance(serializer.validated_data['slot'], Slot) else serializer.validated_data['slot'])
        if not slot.is_active:
            raise Exception("Slot is not active")
        if slot.is_booked:
            raise Exception("Slot already booked")
        slot.is_booked = True
        slot.save()
        serializer.save(driver=self.request.user, slot=slot)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        if booking.driver != request.user and request.user.role != 'owner':
            return Response({'detail':'Not allowed'}, status=status.HTTP_403_FORBIDDEN)
        booking.status = 'cancelled'
        booking.save()
        slot = booking.slot
        slot.is_booked = False
        slot.save()
        return Response({'status':'cancelled'})
