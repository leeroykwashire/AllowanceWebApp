from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create router for ViewSets
router = DefaultRouter()
router.register(r'transactions', views.TransactionViewSet, basename='transactions')
router.register(r'exchange-rates', views.ExchangeRateViewSet, basename='exchange-rates')
router.register(r'advertisements', views.AdvertisementViewSet, basename='advertisements')

urlpatterns = [
    # Authentication endpoints (function-based views)
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login, name='login'),
    
    # Include router URLs for ViewSets
    path('', include(router.urls)),
]
