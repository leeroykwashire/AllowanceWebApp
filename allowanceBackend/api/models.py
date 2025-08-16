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
    image = models.ImageField(upload_to='ads/', blank=True, null=True)
    link_url = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['order']
    
    def __str__(self):
        return self.title
