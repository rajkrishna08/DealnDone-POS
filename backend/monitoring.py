# DealNDone 2025 Monitoring Module
# Azure Monitor / Prometheus Implementation

import time
import logging
import requests
from typing import Dict, Any
import os
from datetime import datetime
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AzureMonitor:
    """Azure Monitor integration for DealNDone 2025"""
    
    def __init__(self):
        self.workspace_id = os.getenv("AZURE_WORKSPACE_ID", "")
        self.workspace_key = os.getenv("AZURE_WORKSPACE_KEY", "")
        self.log_analytics_url = f"https://{self.workspace_id}.ods.opinsights.azure.com/api/logs?api-version=2016-04-01"
        
    def send_metric(self, metric_name: str, value: float, dimensions: Dict[str, str] = None):
        """Send metric to Azure Monitor"""
        try:
            metric_data = {
                "metric_name": metric_name,
                "value": value,
                "timestamp": datetime.utcnow().isoformat(),
                "dimensions": dimensions or {}
            }
            
            headers = {
                "Content-Type": "application/json",
                "Log-Type": "DealNDoneMetrics",
                "x-ms-date": datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.%fZ")
            }
            
            response = requests.post(
                self.log_analytics_url,
                headers=headers,
                data=json.dumps(metric_data)
            )
            
            if response.status_code == 200:
                logger.info(f"Metric sent: {metric_name} = {value}")
            else:
                logger.error(f"Failed to send metric: {response.status_code}")
                
        except Exception as e:
            logger.error(f"Error sending metric: {e}")

class PrometheusMetrics:
    """Prometheus-style metrics for DealNDone 2025"""
    
    def __init__(self):
        self.metrics = {
            "http_requests_total": 0,
            "http_request_duration_seconds": [],
            "sales_total": 0,
            "sales_amount_total": 0.0,
            "errors_total": 0,
            "active_users": 0
        }
    
    def increment_counter(self, metric_name: str, value: int = 1):
        """Increment a counter metric"""
        if metric_name in self.metrics:
            self.metrics[metric_name] += value
    
    def record_duration(self, metric_name: str, duration: float):
        """Record duration metric"""
        if metric_name in self.metrics:
            self.metrics[metric_name].append(duration)
    
    def set_gauge(self, metric_name: str, value: float):
        """Set a gauge metric"""
        if metric_name in self.metrics:
            self.metrics[metric_name] = value
    
    def get_metrics(self) -> Dict[str, Any]:
        """Get current metrics"""
        return self.metrics.copy()

class PerformanceMonitor:
    """Performance monitoring for DealNDone 2025"""
    
    def __init__(self):
        self.azure_monitor = AzureMonitor()
        self.prometheus_metrics = PrometheusMetrics()
        self.start_times = {}
    
    def start_timer(self, operation_name: str):
        """Start timing an operation"""
        self.start_times[operation_name] = time.time()
    
    def end_timer(self, operation_name: str):
        """End timing an operation and record metrics"""
        if operation_name in self.start_times:
            duration = time.time() - self.start_times[operation_name]
            
            # Record Prometheus metric
            self.prometheus_metrics.record_duration("http_request_duration_seconds", duration)
            
            # Send to Azure Monitor
            self.azure_monitor.send_metric(
                f"{operation_name}_duration_seconds",
                duration
            )
            
            # Log performance
            if duration > 1.0:  # Alert for slow operations
                logger.warning(f"Slow operation detected: {operation_name} took {duration:.2f}s")
            
            del self.start_times[operation_name]
    
    def record_sale(self, amount: float, quantity: int):
        """Record a sale for metrics"""
        # Increment counters
        self.prometheus_metrics.increment_counter("sales_total")
        self.prometheus_metrics.increment_counter("sales_amount_total", int(amount))
        
        # Send to Azure Monitor
        self.azure_monitor.send_metric("sales_amount", amount, {
            "quantity": str(quantity),
            "product_type": "shirt"
        })
    
    def record_error(self, error_type: str):
        """Record an error for metrics"""
        self.prometheus_metrics.increment_counter("errors_total")
        
        # Send to Azure Monitor
        self.azure_monitor.send_metric("errors_total", 1, {
            "error_type": error_type
        })
    
    def record_request(self, endpoint: str, status_code: int):
        """Record an HTTP request for metrics"""
        self.prometheus_metrics.increment_counter("http_requests_total")
        
        # Send to Azure Monitor
        self.azure_monitor.send_metric("http_requests_total", 1, {
            "endpoint": endpoint,
            "status_code": str(status_code)
        })

# Global monitoring instance
monitor = PerformanceMonitor()

# Middleware for automatic monitoring
async def monitor_request(request, call_next):
    """Middleware to monitor all requests"""
    start_time = time.time()
    
    # Record request start
    monitor.record_request(str(request.url.path), 200)
    monitor.start_timer("request_processing")
    
    try:
        response = await call_next(request)
        
        # Record successful request
        monitor.end_timer("request_processing")
        
        return response
        
    except Exception as e:
        # Record error
        monitor.record_error(str(type(e).__name__))
        monitor.end_timer("request_processing")
        raise

# Health check with metrics
def get_health_metrics() -> Dict[str, Any]:
    """Get health metrics for monitoring"""
    return {
        "status": "healthy",
        "database": "connected",
        "metrics": monitor.prometheus_metrics.get_metrics(),
        "uptime": time.time(),
        "version": "1.0.0"
    }

# Performance alerts
def check_performance_alerts():
    """Check for performance issues"""
    metrics = monitor.prometheus_metrics.get_metrics()
    
    # Check for high error rate
    if metrics["errors_total"] > 10:
        logger.error("High error rate detected!")
    
    # Check for slow response times
    if metrics["http_request_duration_seconds"]:
        avg_duration = sum(metrics["http_request_duration_seconds"]) / len(metrics["http_request_duration_seconds"])
        if avg_duration > 1.0:
            logger.warning(f"Slow average response time: {avg_duration:.2f}s")
    
    # Check for low sales
    if metrics["sales_total"] < 1:
        logger.info("No sales recorded in current period")

# Uptime monitoring (99.99% target)
class UptimeMonitor:
    """Uptime monitoring for 99.99% target"""
    
    def __init__(self):
        self.start_time = time.time()
        self.downtime_seconds = 0
        self.last_check = time.time()
    
    def record_uptime(self):
        """Record uptime check"""
        current_time = time.time()
        self.last_check = current_time
    
    def calculate_uptime_percentage(self) -> float:
        """Calculate current uptime percentage"""
        total_time = time.time() - self.start_time
        uptime = total_time - self.downtime_seconds
        return (uptime / total_time) * 100 if total_time > 0 else 100.0
    
    def is_meeting_sla(self) -> bool:
        """Check if meeting 99.99% SLA"""
        return self.calculate_uptime_percentage() >= 99.99

# Global uptime monitor
uptime_monitor = UptimeMonitor() 