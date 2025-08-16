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
