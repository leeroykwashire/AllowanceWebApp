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
