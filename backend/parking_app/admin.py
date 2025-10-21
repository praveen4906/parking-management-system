from django.contrib import admin
from .models import User, ParkingLot, Slot, Booking

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role', 'is_staff')

@admin.register(ParkingLot)
class ParkingLotAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'address', 'total_slots', 'lat', 'lng')

@admin.register(Slot)
class SlotAdmin(admin.ModelAdmin):
    list_display = ('lot', 'number', 'is_active', 'is_booked', 'price')

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'driver', 'slot', 'status', 'created_at')