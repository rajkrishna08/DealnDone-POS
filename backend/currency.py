"""
Multi-Currency Support for DealNDone 2025
Handles USD/INR conversion and global currency management
"""

import os
from typing import Dict, Optional
from datetime import datetime, timedelta
import requests
from fastapi import HTTPException

class CurrencyManager:
    """Global multi-currency manager with USD/INR support"""
    
    def __init__(self):
        self.base_currency = "USD"
        self.supported_currencies = ["USD", "INR", "EUR", "GBP"]
        self.exchange_rates = {
            "USD": 1.0,
            "INR": 83.50,  # Default rate, will be updated from API
            "EUR": 0.92,
            "GBP": 0.79
        }
        self.last_update = None
        self.update_interval = timedelta(hours=1)
        
    def get_exchange_rate(self, from_currency: str, to_currency: str) -> float:
        """Get exchange rate between two currencies"""
        if from_currency == to_currency:
            return 1.0
            
        if from_currency not in self.supported_currencies or to_currency not in self.supported_currencies:
            raise ValueError(f"Unsupported currency: {from_currency} or {to_currency}")
            
        # Convert through USD as base
        if from_currency == "USD":
            return self.exchange_rates.get(to_currency, 1.0)
        elif to_currency == "USD":
            return 1.0 / self.exchange_rates.get(from_currency, 1.0)
        else:
            # Convert from_currency to USD, then USD to to_currency
            usd_rate = 1.0 / self.exchange_rates.get(from_currency, 1.0)
            target_rate = self.exchange_rates.get(to_currency, 1.0)
            return usd_rate * target_rate
    
    def convert_price(self, amount: float, from_currency: str, to_currency: str) -> float:
        """Convert price from one currency to another"""
        if amount <= 0:
            return 0.0
            
        exchange_rate = self.get_exchange_rate(from_currency, to_currency)
        converted_amount = amount * exchange_rate
        
        # Round to 2 decimal places for currency
        return round(converted_amount, 2)
    
    def update_exchange_rates(self) -> bool:
        """Update exchange rates from external API"""
        try:
            # Using a free currency API (you can replace with your preferred API)
            api_key = os.getenv("CURRENCY_API_KEY", "")
            if api_key:
                url = f"https://api.exchangerate-api.com/v4/latest/USD"
                response = requests.get(url, timeout=10)
                if response.status_code == 200:
                    data = response.json()
                    self.exchange_rates.update(data.get("rates", {}))
                    self.last_update = datetime.now()
                    return True
            else:
                # Use default rates if no API key
                self.last_update = datetime.now()
                return True
                
        except Exception as e:
            print(f"Failed to update exchange rates: {e}")
            return False
    
    def should_update_rates(self) -> bool:
        """Check if exchange rates need updating"""
        if self.last_update is None:
            return True
        return datetime.now() - self.last_update > self.update_interval
    
    def get_supported_currencies(self) -> list:
        """Get list of supported currencies"""
        return self.supported_currencies.copy()
    
    def format_currency(self, amount: float, currency: str) -> str:
        """Format amount with currency symbol"""
        currency_symbols = {
            "USD": "$",
            "INR": "₹",
            "EUR": "€",
            "GBP": "£"
        }
        
        symbol = currency_symbols.get(currency, currency)
        return f"{symbol}{amount:.2f}"

# Global currency manager instance
currency_manager = CurrencyManager()

def get_currency_manager() -> CurrencyManager:
    """Get the global currency manager instance"""
    return currency_manager

def convert_total_price(price: float, quantity: int, from_currency: str, to_currency: str) -> float:
    """Calculate total price with currency conversion"""
    total = price * quantity
    return currency_manager.convert_price(total, from_currency, to_currency)

def format_price_display(amount: float, currency: str) -> str:
    """Format price for display with currency symbol"""
    return currency_manager.format_currency(amount, currency)

# Initialize exchange rates on module import
if currency_manager.should_update_rates():
    currency_manager.update_exchange_rates() 