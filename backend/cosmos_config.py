"""
Azure Cosmos DB Configuration for DealNDone 2025
Configured for pos.order and product.template collections
"""

import os
from typing import Dict, List, Optional, Any
from datetime import datetime
import json
from azure.cosmos import CosmosClient, PartitionKey
from azure.cosmos.exceptions import CosmosHttpResponseError

class CosmosDBConfig:
    """Azure Cosmos DB configuration and operations"""
    
    def __init__(self):
        self.endpoint = os.getenv("COSMOS_ENDPOINT", "")
        self.key = os.getenv("COSMOS_KEY", "")
        self.database_name = os.getenv("COSMOS_DATABASE", "dealndone2025")
        
        # Collection configurations
        self.collections = {
            "pos_orders": {
                "name": "pos.order",
                "partition_key": "/store_id",
                "unique_keys": ["/order_id"]
            },
            "product_templates": {
                "name": "product.template",
                "partition_key": "/category",
                "unique_keys": ["/product_id"]
            },
            "inventory": {
                "name": "inventory",
                "partition_key": "/store_id",
                "unique_keys": ["/product_id"]
            },
            "customers": {
                "name": "customers",
                "partition_key": "/customer_id",
                "unique_keys": ["/email"]
            }
        }
        
        self.client = None
        self.database = None
        self.containers = {}
        
    def initialize_client(self):
        """Initialize Cosmos DB client"""
        if not self.endpoint or not self.key:
            print("Warning: Cosmos DB credentials not found. Using local SQLite fallback.")
            return False
            
        try:
            self.client = CosmosClient(self.endpoint, self.key)
            return True
        except Exception as e:
            print(f"Failed to initialize Cosmos DB client: {e}")
            return False
    
    def create_database(self):
        """Create database if it doesn't exist"""
        if not self.client:
            return False
            
        try:
            self.database = self.client.create_database_if_not_exists(self.database_name)
            print(f"Database '{self.database_name}' ready")
            return True
        except Exception as e:
            print(f"Failed to create database: {e}")
            return False
    
    def create_containers(self):
        """Create all required containers"""
        if not self.database:
            return False
            
        try:
            for collection_key, config in self.collections.items():
                container_name = config["name"]
                partition_key = PartitionKey(path=config["partition_key"])
                
                # Create container
                container = self.database.create_container_if_not_exists(
                    id=container_name,
                    partition_key=partition_key,
                    offer_throughput=400  # Minimum throughput
                )
                
                self.containers[collection_key] = container
                print(f"Container '{container_name}' ready")
            
            return True
        except Exception as e:
            print(f"Failed to create containers: {e}")
            return False
    
    def setup_database(self):
        """Complete database setup"""
        if self.initialize_client():
            if self.create_database():
                return self.create_containers()
        return False

# Global Cosmos DB instance
cosmos_config = CosmosDBConfig()

class POSOrder:
    """POS Order model for Cosmos DB"""
    
    def __init__(self, order_id: str, store_id: str, items: List[Dict], total: float, 
                 currency: str = "USD", customer_id: Optional[str] = None):
        self.order_id = order_id
        self.store_id = store_id
        self.items = items
        self.total = total
        self.currency = currency
        self.customer_id = customer_id
        self.created_at = datetime.now().isoformat()
        self.status = "completed"
    
    def to_dict(self) -> Dict:
        """Convert to dictionary for Cosmos DB"""
        return {
            "id": self.order_id,
            "order_id": self.order_id,
            "store_id": self.store_id,
            "items": self.items,
            "total": self.total,
            "currency": self.currency,
            "customer_id": self.customer_id,
            "created_at": self.created_at,
            "status": self.status,
            "type": "pos_order"
        }

class ProductTemplate:
    """Product Template model for Cosmos DB"""
    
    def __init__(self, product_id: str, name: str, category: str, price: float,
                 currency: str = "USD", description: Optional[str] = None):
        self.product_id = product_id
        self.name = name
        self.category = category
        self.price = price
        self.currency = currency
        self.description = description
        self.created_at = datetime.now().isoformat()
        self.is_active = True
    
    def to_dict(self) -> Dict:
        """Convert to dictionary for Cosmos DB"""
        return {
            "id": self.product_id,
            "product_id": self.product_id,
            "name": self.name,
            "category": self.category,
            "price": self.price,
            "currency": self.currency,
            "description": self.description,
            "created_at": self.created_at,
            "is_active": self.is_active,
            "type": "product_template"
        }

class CosmosDBService:
    """Service class for Cosmos DB operations"""
    
    def __init__(self):
        self.config = cosmos_config
        self.is_available = self.config.setup_database()
    
    def create_pos_order(self, order: POSOrder) -> bool:
        """Create a new POS order in Cosmos DB"""
        if not self.is_available:
            return False
            
        try:
            container = self.config.containers.get("pos_orders")
            if container:
                container.create_item(order.to_dict())
                return True
        except Exception as e:
            print(f"Failed to create POS order: {e}")
        
        return False
    
    def get_pos_orders(self, store_id: str, limit: int = 100) -> List[Dict]:
        """Get POS orders for a store"""
        if not self.is_available:
            return []
            
        try:
            container = self.config.containers.get("pos_orders")
            if container:
                query = "SELECT * FROM c WHERE c.store_id = @store_id AND c.type = 'pos_order' ORDER BY c.created_at DESC"
                parameters = [{"name": "@store_id", "value": store_id}]
                
                items = list(container.query_items(
                    query=query,
                    parameters=parameters,
                    enable_cross_partition_query=False
                ))
                
                return items[:limit]
        except Exception as e:
            print(f"Failed to get POS orders: {e}")
        
        return []
    
    def create_product_template(self, product: ProductTemplate) -> bool:
        """Create a new product template in Cosmos DB"""
        if not self.is_available:
            return False
            
        try:
            container = self.config.containers.get("product_templates")
            if container:
                container.create_item(product.to_dict())
                return True
        except Exception as e:
            print(f"Failed to create product template: {e}")
        
        return False
    
    def get_product_templates(self, category: Optional[str] = None) -> List[Dict]:
        """Get product templates"""
        if not self.is_available:
            return []
            
        try:
            container = self.config.containers.get("product_templates")
            if container:
                if category:
                    query = "SELECT * FROM c WHERE c.category = @category AND c.type = 'product_template'"
                    parameters = [{"name": "@category", "value": category}]
                else:
                    query = "SELECT * FROM c WHERE c.type = 'product_template'"
                    parameters = []
                
                items = list(container.query_items(
                    query=query,
                    parameters=parameters,
                    enable_cross_partition_query=True
                ))
                
                return items
        except Exception as e:
            print(f"Failed to get product templates: {e}")
        
        return []
    
    def update_inventory(self, store_id: str, product_id: str, quantity: int) -> bool:
        """Update inventory for a product in a store"""
        if not self.is_available:
            return False
            
        try:
            container = self.config.containers.get("inventory")
            if container:
                # Try to get existing inventory
                query = "SELECT * FROM c WHERE c.store_id = @store_id AND c.product_id = @product_id"
                parameters = [
                    {"name": "@store_id", "value": store_id},
                    {"name": "@product_id", "value": product_id}
                ]
                
                items = list(container.query_items(
                    query=query,
                    parameters=parameters,
                    enable_cross_partition_query=False
                ))
                
                if items:
                    # Update existing inventory
                    item = items[0]
                    item["quantity"] = quantity
                    item["updated_at"] = datetime.now().isoformat()
                    container.replace_item(item, item)
                else:
                    # Create new inventory record
                    inventory_item = {
                        "id": f"{store_id}_{product_id}",
                        "store_id": store_id,
                        "product_id": product_id,
                        "quantity": quantity,
                        "created_at": datetime.now().isoformat(),
                        "updated_at": datetime.now().isoformat(),
                        "type": "inventory"
                    }
                    container.create_item(inventory_item)
                
                return True
        except Exception as e:
            print(f"Failed to update inventory: {e}")
        
        return False
    
    def get_inventory(self, store_id: str) -> List[Dict]:
        """Get inventory for a store"""
        if not self.is_available:
            return []
            
        try:
            container = self.config.containers.get("inventory")
            if container:
                query = "SELECT * FROM c WHERE c.store_id = @store_id AND c.type = 'inventory'"
                parameters = [{"name": "@store_id", "value": store_id}]
                
                items = list(container.query_items(
                    query=query,
                    parameters=parameters,
                    enable_cross_partition_query=False
                ))
                
                return items
        except Exception as e:
            print(f"Failed to get inventory: {e}")
        
        return []

# Global service instance
cosmos_service = CosmosDBService()

def get_cosmos_service() -> CosmosDBService:
    """Get the global Cosmos DB service instance"""
    return cosmos_service

def is_cosmos_available() -> bool:
    """Check if Cosmos DB is available"""
    return cosmos_service.is_available 