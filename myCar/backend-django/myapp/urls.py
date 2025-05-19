from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RecordViewSet,
    CarViewSet,
    TransactionViewSet,
    PaymentViewSet,
    MaintenanceTaskViewSet,
    CarMaintenanceViewSet,
    register_user, 
)

router = DefaultRouter()
router.register(r'customers',         RecordViewSet,       basename='customer')
router.register(r'cars',              CarViewSet,            basename='car')
router.register(r'transactions',      TransactionViewSet,    basename='transaction')
router.register(r'payments',          PaymentViewSet,        basename='payment')
router.register(r'maintenance-tasks', MaintenanceTaskViewSet,basename='maintenancetask')
router.register(r'car-maintenance',   CarMaintenanceViewSet, basename='carmaintenance')

urlpatterns = [
    path('api/', include(router.urls)),
     path('api/register/', register_user, name='register'),
]

from django.conf import settings
from django.conf.urls.static import static
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)