from rest_framework import viewsets
from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Record, Car, Transaction, Payment, MaintenanceTask, CarMaintenance
from .serializers import (
    RecordSerializer,
    CarSerializer,
    TransactionSerializer,
    PaymentSerializer,
    MaintenanceTaskSerializer,
    CarMaintenanceSerializer,
)
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

class RecordViewSet(viewsets.ModelViewSet):
    """API endpoint for Records"""
    queryset = Record.objects.all()
    serializer_class = RecordSerializer


class CarViewSet(viewsets.ModelViewSet):
    """API endpoint for Cars"""
    queryset = Car.objects.all()
    serializer_class = CarSerializer


class TransactionViewSet(viewsets.ModelViewSet):
    """API endpoint for Transactions"""
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer


class PaymentViewSet(viewsets.ModelViewSet):
    """API endpoint for Payments"""
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

class MaintenanceTaskViewSet(viewsets.ModelViewSet):
    """API endpoint for Maintenance Tasks"""
    queryset = MaintenanceTask.objects.all()
    serializer_class = MaintenanceTaskSerializer


class CarMaintenanceViewSet(viewsets.ModelViewSet):
    """API endpoint for Car Maintenance Records"""
    queryset = CarMaintenance.objects.all()
    serializer_class = CarMaintenanceSerializer




@api_view(['POST'])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email')

    if not username or not password:
        return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, password=password, email=email)
    user.save()

    return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)