import requests
import json

BASE_URL = "http://127.0.0.1:8000/api"

def test_exchange_rates():
    """Test the exchange rates endpoint"""
    print("🔄 Testing Exchange Rates endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/exchange-rates/")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Exchange Rates retrieved successfully: {len(data)} currencies")
            for rate in data:
                print(f"   - {rate['currency_code']}: {rate['rate_to_usd']}")
            return True
        else:
            print(f"❌ Error: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Exception: {e}")
        return False

def test_advertisements():
    """Test the advertisements endpoint"""
    print("\n🔄 Testing Advertisements endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/advertisements/")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Advertisements retrieved successfully: {len(data)} ads")
            for ad in data:
                print(f"   - {ad['title']}: {ad['description'][:50]}...")
            return True
        else:
            print(f"❌ Error: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Exception: {e}")
        return False

def test_user_registration():
    """Test user registration endpoint"""
    print("\n🔄 Testing User Registration endpoint...")
    try:
        user_data = {
            "username": "testuser",
            "email": "test@example.com",
            "first_name": "Test",
            "last_name": "User",
            "password": "testpassword123",
            "password_confirm": "testpassword123"
        }
        response = requests.post(f"{BASE_URL}/auth/register/", json=user_data)
        if response.status_code == 201:
            data = response.json()
            print(f"✅ User registered successfully: {data['user']['username']}")
            print(f"   Access token received: {data['access'][:20]}...")
            return data['access']
        else:
            print(f"❌ Error: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"❌ Exception: {e}")
        return None

def test_transaction_calculation(access_token):
    """Test transaction calculation endpoint"""
    print("\n🔄 Testing Transaction Calculation endpoint...")
    try:
        headers = {"Authorization": f"Bearer {access_token}"}
        transaction_data = {
            "amount_usd": "100.00",
            "target_currency": "GBP",
            "recipient_name": "John Doe"
        }
        response = requests.post(f"{BASE_URL}/transactions/calculate/", 
                               json=transaction_data, headers=headers)
        if response.status_code == 200:
            data = response.json()
            print("✅ Transaction calculation successful:")
            print(f"   Amount USD: ${data['amount_usd']}")
            print(f"   Target Currency: {data['target_currency']}")
            print(f"   Exchange Rate: {data['exchange_rate']}")
            print(f"   Fee: ${data['fee_amount']} ({data['fee_percentage']}%)")
            print(f"   Final Amount: {data['final_amount']} {data['target_currency']}")
            return True
        else:
            print(f"❌ Error: {response.status_code} - {response.text}")
            return False
    except Exception as e:
        print(f"❌ Exception: {e}")
        return False

if __name__ == "__main__":
    print("🚀 Testing Money Transfer API Endpoints")
    print("=" * 50)
    
    # Test public endpoints
    exchange_rates_ok = test_exchange_rates()
    advertisements_ok = test_advertisements()
    
    # Test authentication and protected endpoints
    access_token = test_user_registration()
    if access_token:
        transaction_calc_ok = test_transaction_calculation(access_token)
    else:
        transaction_calc_ok = False
    
    print("\n" + "=" * 50)
    print("📊 Test Results Summary:")
    print(f"   Exchange Rates: {'✅ PASS' if exchange_rates_ok else '❌ FAIL'}")
    print(f"   Advertisements: {'✅ PASS' if advertisements_ok else '❌ FAIL'}")
    print(f"   User Registration: {'✅ PASS' if access_token else '❌ FAIL'}")
    print(f"   Transaction Calculation: {'✅ PASS' if transaction_calc_ok else '❌ FAIL'}")
    
    all_tests_passed = all([exchange_rates_ok, advertisements_ok, access_token, transaction_calc_ok])
    print(f"\n🎯 Overall Status: {'✅ ALL TESTS PASSED' if all_tests_passed else '❌ SOME TESTS FAILED'}")
