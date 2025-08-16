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
