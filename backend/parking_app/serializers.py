from rest_framework import serializers
from .models import User, ParkingLot, Slot, Booking
from django.contrib.auth.password_validation import validate_password

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    class Meta:
        model = User
        fields = ('id','username','email','password','role','phone','first_name','last_name')

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class SlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = Slot
        fields = ('id','lot','number','is_active','is_booked','price')

class ParkingLotSerializer(serializers.ModelSerializer):
    available_slots = serializers.IntegerField(read_only=True)
    slots = SlotSerializer(many=True, read_only=True)
    owner = serializers.ReadOnlyField(source='owner.id')
    class Meta:
        model = ParkingLot
        fields = ('id','owner','name','address','total_slots','lat','lng','is_active','available_slots','slots')

class BookingSerializer(serializers.ModelSerializer):
    driver = serializers.ReadOnlyField(source='driver.id')
    slot_detail = SlotSerializer(source='slot', read_only=True)
    lot_id = serializers.ReadOnlyField(source='slot.lot.id')
    class Meta:
        model = Booking
        fields = ('id','driver','slot','slot_detail','lot_id','start_time','end_time','status','created_at')