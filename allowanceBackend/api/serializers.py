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
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Advertisement
        fields = '__all__'
        read_only_fields = ('id',)

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and hasattr(obj.image, 'url'):
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
