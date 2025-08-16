# Django REST API Backend - Execution Plan
## Zimbabwean Money Transfer Web App Backend

## Overview
This document outlines the step-by-step execution plan for creating the Django REST API backend that will serve the Zimbabwean money transfer web application.

## Prerequisites
- Django project already exists in `/allowanceBackend`
- Python virtual environment set up in `/myenv`
- Django and basic dependencies installed

## Step 1: Create Django App and Install Dependencies

### 1.1 Create Main App
```bash
cd allowanceBackend
python manage.py startapp api
```

### 1.2 Install Required Packages
```bash
pip install djangorestframework 
pip install djangorestframework-simplejwt
pip install django-cors-headers
pip install requests
pip install python-decouple
```

### 1.3 Update requirements.txt
```bash
pip freeze > requirements.txt
```

## Step 2: Django Settings Configuration

### 2.1 Update `allowanceBackend/settings.py`
Add to INSTALLED_APPS:
```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt',
    'corsheaders',
    'api',
]
```

Add middleware:
```python
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
```

Add REST Framework configuration:
```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}
```

Add JWT configuration:
```python
from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
}
```

Add CORS configuration:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # React app
    "http://127.0.0.1:3000",
]

CORS_ALLOW_CREDENTIALS = True
```

## Step 3: Create Database Models

### 3.1 Create `api/models.py`
```python
from django.db import models
from django.contrib.auth.models import User
from decimal import Decimal
import uuid

class ExchangeRate(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    currency_code = models.CharField(max_length=3, unique=True)
    rate_to_usd = models.DecimalField(max_digits=10, decimal_places=4)
    last_updated = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.currency_code}: {self.rate_to_usd}"

class Transaction(models.Model):
    CURRENCY_CHOICES = [
        ('GBP', 'British Pound'),
        ('ZAR', 'South African Rand'),
    ]
    
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    transaction_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount_usd = models.DecimalField(max_digits=10, decimal_places=2)
    target_currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES)
    exchange_rate = models.DecimalField(max_digits=10, decimal_places=4)
    fee_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    fee_amount = models.DecimalField(max_digits=10, decimal_places=2)
    final_amount = models.DecimalField(max_digits=10, decimal_places=2)
    recipient_name = models.CharField(max_length=100)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.username} - ${self.amount_usd} to {self.target_currency}"

class Advertisement(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=200)
    description = models.TextField()
    image_url = models.URLField(blank=True)
    link_url = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return self.title
```

## Step 4: Create Serializers

### 4.1 Create `api/serializers.py`
```python
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import Transaction, ExchangeRate, Advertisement
from decimal import Decimal
import math

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name', 'password', 'password_confirm')
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()
    
    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            data['user'] = user
        return data

class ExchangeRateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExchangeRate
        fields = '__all__'

class TransactionCalculationSerializer(serializers.Serializer):
    amount_usd = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=1)
    target_currency = serializers.ChoiceField(choices=['GBP', 'ZAR'])
    recipient_name = serializers.CharField(max_length=100)
    
    def validate_amount_usd(self, value):
        # Set minimum and maximum limits
        if value < Decimal('10.00'):
            raise serializers.ValidationError('Minimum transfer amount is $10.00')
        if value > Decimal('10000.00'):
            raise serializers.ValidationError('Maximum transfer amount is $10,000.00')
        return value

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'
        read_only_fields = ('user', 'id', 'transaction_id', 'exchange_rate', 'fee_percentage', 'fee_amount', 'final_amount')

class AdvertisementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Advertisement
        fields = '__all__'
        read_only_fields = ('id',)
```

## Step 5: Create API Views

### 5.1 Create `api/views.py`
```python
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.core.paginator import Paginator
from .models import Transaction, ExchangeRate, Advertisement
from .serializers import (
    UserRegistrationSerializer, 
    UserLoginSerializer,
    TransactionCalculationSerializer,
    TransactionSerializer,
    ExchangeRateSerializer,
    AdvertisementSerializer
)
from .services import ExchangeRateService, TransactionService
from decimal import Decimal

# Authentication Views (keeping as function-based for simplicity)
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            },
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            },
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ViewSet-based Views
class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        # This won't be used directly, we'll use custom actions
        serializer.save(user=self.request.user)
    
    @action(detail=False, methods=['post'], url_path='calculate')
    def calculate_transaction(self, request):
        serializer = TransactionCalculationSerializer(data=request.data)
        if serializer.is_valid():
            result = TransactionService.calculate_transaction(
                serializer.validated_data['amount_usd'],
                serializer.validated_data['target_currency']
            )
            return Response(result)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'], url_path='send')
    def create_transaction(self, request):
        calculation_serializer = TransactionCalculationSerializer(data=request.data)
        if calculation_serializer.is_valid():
            transaction_data = TransactionService.create_transaction(
                user=request.user,
                **calculation_serializer.validated_data
            )
            return Response(transaction_data, status=status.HTTP_201_CREATED)
        return Response(calculation_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'], url_path='history')
    def transaction_history(self, request):
        transactions = self.get_queryset()
        
        # Pagination
        page = request.GET.get('page', 1)
        paginator = Paginator(transactions, 10)  # 10 transactions per page
        page_obj = paginator.get_page(page)
        
        serializer = TransactionSerializer(page_obj, many=True)
        
        return Response({
            'transactions': serializer.data,
            'total_pages': paginator.num_pages,
            'current_page': int(page),
            'has_next': page_obj.has_next(),
            'has_previous': page_obj.has_previous(),
        })

class ExchangeRateViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ExchangeRate.objects.filter(currency_code__in=['GBP', 'ZAR'])
    serializer_class = ExchangeRateSerializer
    permission_classes = [AllowAny]
    
    def list(self, request, *args, **kwargs):
        # Update rates before returning
        ExchangeRateService.update_rates()
        return super().list(request, *args, **kwargs)

class AdvertisementViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Advertisement.objects.filter(is_active=True)
    serializer_class = AdvertisementSerializer
    permission_classes = [AllowAny]
```

## Step 6: Create Service Classes

### 6.1 Create `api/services.py`
```python
import requests
from decimal import Decimal, ROUND_UP
from django.utils import timezone
from .models import ExchangeRate, Transaction
import math

class ExchangeRateService:
    API_URL = "https://68976304250b078c2041c7fc.mockapi.io/api/wiremit/InterviewAPIS"
    
    @classmethod
    def fetch_rates_from_api(cls):
        try:
            response = requests.get(cls.API_URL, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            # Parse the non-flat structure
            rates = {}
            for item in data:
                for currency, rate in item.items():
                    rates[currency] = Decimal(str(rate))
            
            return rates
        except Exception as e:
            print(f"Error fetching exchange rates: {e}")
            return None
    
    @classmethod
    def update_rates(cls):
        rates_data = cls.fetch_rates_from_api()
        if rates_data:
            for currency_code, rate in rates_data.items():
                if currency_code in ['USD', 'GBP', 'ZAR']:
                    ExchangeRate.objects.update_or_create(
                        currency_code=currency_code,
                        defaults={'rate_to_usd': rate}
                    )
            return True
        return False
    
    @classmethod
    def get_rate(cls, currency_code):
        try:
            rate = ExchangeRate.objects.get(currency_code=currency_code)
            return rate.rate_to_usd
        except ExchangeRate.DoesNotExist:
            cls.update_rates()
            try:
                rate = ExchangeRate.objects.get(currency_code=currency_code)
                return rate.rate_to_usd
            except ExchangeRate.DoesNotExist:
                return None

class TransactionService:
    FEE_RATES = {
        'GBP': Decimal('0.10'),  # 10%
        'ZAR': Decimal('0.20'),  # 20%
    }
    
    @classmethod
    def calculate_transaction(cls, amount_usd, target_currency):
        # Get exchange rate
        rate = ExchangeRateService.get_rate(target_currency)
        if not rate:
            raise ValueError(f"Exchange rate not available for {target_currency}")
        
        # Calculate fee
        fee_percentage = cls.FEE_RATES.get(target_currency, Decimal('0.15'))
        fee_amount = amount_usd * fee_percentage
        
        # Amount after fee deduction
        amount_after_fee = amount_usd - fee_amount
        
        # Convert to target currency
        converted_amount = amount_after_fee * rate
        
        # Round UP to maintain accuracy
        final_amount = converted_amount.quantize(Decimal('0.01'), rounding=ROUND_UP)
        
        return {
            'amount_usd': amount_usd,
            'target_currency': target_currency,
            'exchange_rate': rate,
            'fee_percentage': fee_percentage * 100,  # Convert to percentage
            'fee_amount': fee_amount.quantize(Decimal('0.01'), rounding=ROUND_UP),
            'amount_after_fee': amount_after_fee.quantize(Decimal('0.01'), rounding=ROUND_UP),
            'final_amount': final_amount,
        }
    
    @classmethod
    def create_transaction(cls, user, amount_usd, target_currency, recipient_name):
        calculation = cls.calculate_transaction(amount_usd, target_currency)
        
        transaction = Transaction.objects.create(
            user=user,
            amount_usd=amount_usd,
            target_currency=target_currency,
            exchange_rate=calculation['exchange_rate'],
            fee_percentage=calculation['fee_percentage'],
            fee_amount=calculation['fee_amount'],
            final_amount=calculation['final_amount'],
            recipient_name=recipient_name,
            status='COMPLETED'
        )
        
        return {
            'transaction_id': str(transaction.transaction_id),
            'status': transaction.status,
            **calculation
        }
```

## Step 7: URL Configuration

### 7.1 Create `api/urls.py`
```python
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
```

### 7.2 Update `allowanceBackend/urls.py`
```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]
```

## Step 8: Create Admin Interface

### 8.1 Update `api/admin.py`
```python
from django.contrib import admin
from .models import Transaction, ExchangeRate, Advertisement

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('transaction_id', 'user', 'amount_usd', 'target_currency', 'final_amount', 'status', 'created_at')
    list_filter = ('target_currency', 'status', 'created_at')
    search_fields = ('transaction_id', 'user__username', 'recipient_name')
    readonly_fields = ('id', 'transaction_id', 'created_at', 'updated_at')

@admin.register(ExchangeRate)
class ExchangeRateAdmin(admin.ModelAdmin):
    list_display = ('currency_code', 'rate_to_usd', 'last_updated')
    list_filter = ('currency_code', 'last_updated')
    readonly_fields = ('id',)

@admin.register(Advertisement)
class AdvertisementAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_active', 'order', 'created_at')
    list_filter = ('is_active', 'created_at')
    ordering = ('order',)
    readonly_fields = ('id',)
```

## Step 9: Database Setup and Migrations

### 9.1 Create and Run Migrations
```bash
python manage.py makemigrations api
python manage.py migrate
```

### 9.2 Create Superuser
```bash
python manage.py createsuperuser
```

### 9.3 Populate Initial Data
```bash
python manage.py shell
```

In the shell:
```python
from api.models import Advertisement
from api.services import ExchangeRateService

# Create sample advertisements
Advertisement.objects.create(
    title="Send Money to UK - Special Rates!",
    description="Get the best exchange rates for UK transfers this month.",
    image_url="https://via.placeholder.com/400x200",
    link_url="https://example.com/uk-offer",
    order=1
)

Advertisement.objects.create(
    title="South Africa Transfer Promotion",
    description="Zero fees on your first transfer to South Africa!",
    image_url="https://via.placeholder.com/400x200", 
    link_url="https://example.com/sa-offer",
    order=2
)

# Update exchange rates
ExchangeRateService.update_rates()
```

## Step 10: Testing the API

### 10.1 Start Development Server
```bash
python manage.py runserver
```

### 10.2 Test Endpoints
Use tools like Postman or curl to test:

**Authentication:**
- POST `/api/auth/register/` - User registration
- POST `/api/auth/login/` - User login  

**Exchange Rates:**
- GET `/api/exchange-rates/` - Get current rates

**Transactions:**
- POST `/api/transactions/calculate/` - Calculate transaction fees
- POST `/api/transactions/send/` - Create new transaction
- GET `/api/transactions/history/` - Get user's transaction history
- GET `/api/transactions/` - List all user transactions
- GET `/api/transactions/{uuid}/` - Get specific transaction

**Advertisements:**
- GET `/api/advertisements/` - Get active advertisements

## Step 11: Additional Configurations

### 11.1 Environment Variables (Optional)
Create `.env` file:
```
SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_URL=sqlite:///db.sqlite3
```

### 11.2 Update settings.py to use environment variables:
```python
from decouple import config

SECRET_KEY = config('SECRET_KEY', default='your-default-secret-key')
DEBUG = config('DEBUG', default=True, cast=bool)
```

## API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register/` | User registration | No |
| POST | `/api/auth/login/` | User login | No |
| GET | `/api/exchange-rates/` | Get current exchange rates | No |
| GET | `/api/advertisements/` | Get active advertisements | No |
| POST | `/api/transactions/calculate/` | Calculate transaction fees | Yes |
| POST | `/api/transactions/send/` | Create new transaction | Yes |
| GET | `/api/transactions/history/` | Get user's transaction history | Yes |
| GET | `/api/transactions/` | List all user transactions | Yes |
| GET | `/api/transactions/{uuid}/` | Get specific transaction by UUID | Yes |

## Success Criteria Checklist

- ✅ User registration and authentication with JWT
- ✅ SQLite database with proper models
- ✅ Transaction calculation with proper rounding UP
- ✅ Exchange rate integration with external API
- ✅ Transaction history with pagination
- ✅ Advertisement management
- ✅ Proper error handling and validation
- ✅ CORS configuration for React frontend
- ✅ Admin interface for data management

## Next Steps
1. Execute all steps in order
2. Test each endpoint thoroughly
3. Create sample data for development
4. Document any issues encountered
5. Prepare for frontend integration
