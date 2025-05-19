# serializers.py
from rest_framework import serializers
from .models import (
    Record,
    MaintenanceTask,
    Car,
    CarMaintenance,
    Transaction,
    Payment
)


class RecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = Record
        fields = '__all__'


class MaintenanceTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaintenanceTask
        fields = '__all__'


class CarMaintenanceSerializer(serializers.ModelSerializer):
    # Write‐only PKs for creating/updating
    car_id = serializers.PrimaryKeyRelatedField(
        source='car',
        queryset=Car.objects.all(),
        write_only=True
    )
    task_id = serializers.PrimaryKeyRelatedField(
        source='task',
        queryset=MaintenanceTask.objects.all(),
        write_only=True
    )

    # Read‐only nested task info
    task = MaintenanceTaskSerializer(read_only=True)

    # Read‐only car fields (avoid nesting full CarSerializer)
    car_make      = serializers.CharField(source='car.make',       read_only=True)
    car_model     = serializers.CharField(source='car.model',      read_only=True)
    license_plate = serializers.CharField(source='car.license_plate', read_only=True)

    class Meta:
        model  = CarMaintenance
        fields = [
            'id',
            'car_id',         # for writes
            'task_id',        # for writes
            'car_make',       # for reads
            'car_model',      # for reads
            'license_plate',  # for reads
            'task',           # full task info
            'performed_at',
            'notes',
        ]


class CarSerializer(serializers.ModelSerializer):
    maintenance_records = serializers.SerializerMethodField()

    class Meta:
        model  = Car
        fields = '__all__'

    def get_maintenance_records(self, obj):
        # Import here to avoid circular at module‐load time
        from .serializers import CarMaintenanceSerializer
        qs = obj.carmaintenance_set.all()
        return CarMaintenanceSerializer(qs, many=True).data

    def validate_license_plate(self, value):
        if self.instance:  # editing
            if Car.objects.exclude(pk=self.instance.pk).filter(license_plate=value).exists():
                raise serializers.ValidationError("This license plate is already taken.")
        else:  # creating
            if Car.objects.filter(license_plate=value).exists():
                raise serializers.ValidationError("This license plate is already taken.")
        return value

class TransactionSerializer(serializers.ModelSerializer):
    # Nested representations for reads
    car      = CarSerializer(read_only=True)
    customer = RecordSerializer(read_only=True)

    # Write‐only PK fields for POST/PUT/PATCH
    car_id = serializers.PrimaryKeyRelatedField(
        queryset=Car.objects.all(),
        source='car',
        write_only=True
    )
    customer_id = serializers.PrimaryKeyRelatedField(
        queryset=Record.objects.all(),
        source='customer',
        write_only=True
    )

    class Meta:
        model = Transaction
        fields = [
            'id',
            'rental_start_date',
            'rental_end_date',
            'rental_price',
            'status',
            'payment_status',
            'created_at',
            'updated_at',
            # Nested read‐only
            'car',
            'customer',
            # Write‐only IDs
            'car_id',
            'customer_id',
        ]


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

    def create(self, validated_data):
        payment = super().create(validated_data)
        tx = payment.transaction
        tx.payment_status = 'paid'
        tx.save(update_fields=['payment_status'])
        return payment
