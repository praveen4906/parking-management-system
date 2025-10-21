from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('driver', 'Driver'),
        ('owner', 'Owner'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='driver')
    phone = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return f"{self.username} ({self.role})"

class ParkingLot(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='lots')
    name = models.CharField(max_length=200)
    address = models.CharField(max_length=400, blank=True)
    total_slots = models.PositiveIntegerField(default=0)
    lat = models.FloatField()
    lng = models.FloatField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

    @property
    def available_slots(self):
        return self.slots.filter(is_active=True, is_booked=False).count()

class Slot(models.Model):
    lot = models.ForeignKey(ParkingLot, on_delete=models.CASCADE, related_name='slots')
    number = models.PositiveIntegerField()
    is_active = models.BooleanField(default=True)
    is_booked = models.BooleanField(default=False)
    price = models.DecimalField(max_digits=8, decimal_places=2, default=0.0)  # INRs

    class Meta:
        unique_together = ('lot', 'number')

    def __str__(self):
        return f"{self.lot.name} - Slot {self.number}"

class Booking(models.Model):
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    driver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    slot = models.ForeignKey(Slot, on_delete=models.CASCADE, related_name='bookings')
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Booking {self.id} by {self.driver.username}"