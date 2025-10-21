from django.core.management.base import BaseCommand
from parking_app.models import User, ParkingLot, Slot
import random

class Command(BaseCommand):
    help = "Seed database with demo users, lots (India)"

    def handle(self, *args, **options):
        if User.objects.filter(username='driver1').exists():
            self.stdout.write(self.style.WARNING("Seed already applied."))
            return

        driver = User.objects.create_user(username='driver1', email='driver1@example.com', password='password', role='driver', first_name='Driver', phone='9999999999')
        owner = User.objects.create_user(username='owner1', email='owner1@example.com', password='password', role='owner', first_name='Owner', phone='8888888888')
        self.stdout.write(self.style.SUCCESS("Created driver1 and owner1 (password: password)"))

        india_samples = [
            ('Delhi Parking', 'Connaught Place, New Delhi', 28.6320,77.2195),
            ('Mumbai Central Lot', 'Fort, Mumbai', 18.9333,72.8333),
            ('Bengaluru Park', 'MG Road, Bengaluru', 12.9759,77.6050),
            ('Chennai Lot', 'Anna Salai, Chennai', 13.0827,80.2707),
        ]
        for name, addr, lat, lng in india_samples:
            lot = ParkingLot.objects.create(owner=owner, name=name, address=addr, total_slots=6, lat=lat, lng=lng)
            # create slots
            for i in range(1, lot.total_slots+1):
                Slot.objects.create(lot=lot, number=i, price=random.choice([20,30,50]))
            self.stdout.write(self.style.SUCCESS(f"Created lot {name}"))

        self.stdout.write(self.style.SUCCESS("Seeding done."))