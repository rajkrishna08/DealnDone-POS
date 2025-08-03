#!/usr/bin/env python3
"""
Complete System Test for Deal n Done POS
Tests all components: MCP sync, DealBot integration, multi-user, subdomains
"""

import sys
import os
import sqlite3
import requests
import json
from datetime import datetime

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_database_connection():
    """Test database connectivity and schema"""
    print("🔍 Testing Database Connection")
    print("-" * 30)
    
    try:
        conn = sqlite3.connect('dealndone.db')
        cursor = conn.cursor()
        
        # Test tables exist
        tables = ['users', 'organizations', 'usage_tracking', 'audit_logs']
        for table in tables:
            cursor.execute(f"SELECT name FROM sqlite_master WHERE type='table' AND name='{table}'")
            if cursor.fetchone():
                print(f"✅ Table exists: {table}")
            else:
                print(f"❌ Table missing: {table}")
        
        # Test test accounts
        cursor.execute("SELECT store_name, role, plan_type FROM users WHERE role IN ('ceo', 'franchisee', 'employee', 'security_officer')")
        accounts = cursor.fetchall()
        print(f"✅ Found {len(accounts)} franchise test accounts")
        
        for account in accounts:
            print(f"   - {account[0]} ({account[1]}, {account[2]})")
        
        conn.close()
        return True
    except Exception as e:
        print(f"❌ Database test failed: {e}")
        return False

def test_mcp_endpoints():
    """Test MCP endpoints with real data"""
    print("\n🔍 Testing MCP Endpoints")
    print("-" * 30)
    
    base_url = "http://localhost:8005"
    
    # Test endpoints
    endpoints = [
        "/mcp/health",
        "/mcp/test", 
        "/health"
    ]
    
    for endpoint in endpoints:
        try:
            response = requests.get(f"{base_url}{endpoint}", timeout=5)
            if response.status_code == 200:
                print(f"✅ {endpoint} - Working")
            else:
                print(f"❌ {endpoint} - Status {response.status_code}")
        except requests.exceptions.ConnectionError:
            print(f"❌ {endpoint} - Connection refused (server not running)")
        except Exception as e:
            print(f"❌ {endpoint} - Error: {e}")

def test_dealbot_integration():
    """Test DealBot MCP integration"""
    print("\n🔍 Testing DealBot MCP Integration")
    print("-" * 30)
    
    base_url = "http://localhost:8005"
    
    # Test DealBot chat endpoint
    try:
        response = requests.post(
            f"{base_url}/dealbots/chat",
            json={"message": "create outlet downtown"},
            headers={"Content-Type": "application/json"},
            timeout=5
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ DealBot chat - Working")
            print(f"   Response: {data.get('response', 'No response')[:50]}...")
        else:
            print(f"❌ DealBot chat - Status {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("❌ DealBot chat - Connection refused (server not running)")
    except Exception as e:
        print(f"❌ DealBot chat - Error: {e}")

def test_orchestrator_system():
    """Test Master Orchestrator system"""
    print("\n🔍 Testing Master Orchestrator")
    print("-" * 30)
    
    try:
        from ai.orchestrator import get_orchestrator
        
        orchestrator = get_orchestrator()
        
        # Test sub-agent assignment
        test_tasks = [
            "Create React component",
            "Add JWT validation", 
            "Write Pytest tests"
        ]
        
        for task in test_tasks:
            agent = orchestrator.assign_task(task)
            print(f"✅ Task: {task} → {agent}")
        
        # Test delegation planning
        plan = orchestrator.create_delegation_plan("Build MCP Dashboard")
        print(f"✅ Created plan with {len(plan)} tasks")
        
        return True
    except Exception as e:
        print(f"❌ Orchestrator test failed: {e}")
        return False

def test_frontend_urls():
    """Test frontend URLs and routing"""
    print("\n🔍 Testing Frontend URLs")
    print("-" * 30)
    
    urls = [
        "http://localhost:3000",
        "http://localhost:3000/login",
        "http://localhost:3000/mcp-dashboard",
        "http://localhost:3000/orchestrator-monitor"
    ]
    
    for url in urls:
        try:
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                print(f"✅ {url} - Working")
            else:
                print(f"❌ {url} - Status {response.status_code}")
        except requests.exceptions.ConnectionError:
            print(f"❌ {url} - Connection refused (frontend not running)")
        except Exception as e:
            print(f"❌ {url} - Error: {e}")

def test_subdomain_system():
    """Test subdomain functionality"""
    print("\n🔍 Testing Subdomain System")
    print("-" * 30)
    
    # Test subdomain URLs
    subdomains = [
        "honeyhq.localhost:3000",
        "honeydowntown.localhost:3000", 
        "tailorjohn.localhost:3000",
        "securityadmin.localhost:3000"
    ]
    
    for subdomain in subdomains:
        url = f"http://{subdomain}"
        try:
            response = requests.get(url, timeout=5)
            if response.status_code == 200:
                print(f"✅ {subdomain} - Working")
            else:
                print(f"⚠️  {subdomain} - Status {response.status_code}")
        except requests.exceptions.ConnectionError:
            print(f"❌ {subdomain} - Connection refused")
        except Exception as e:
            print(f"❌ {subdomain} - Error: {e}")

def main():
    """Run complete system test"""
    print("🚀 Complete System Test for Deal n Done POS")
    print("=" * 60)
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    # Test results
    results = {
        "database": False,
        "mcp_endpoints": False,
        "dealbot": False,
        "orchestrator": False,
        "frontend": False,
        "subdomains": False
    }
    
    # Run tests
    results["database"] = test_database_connection()
    test_mcp_endpoints()
    test_dealbot_integration()
    results["orchestrator"] = test_orchestrator_system()
    test_frontend_urls()
    test_subdomain_system()
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 SYSTEM TEST SUMMARY")
    print("=" * 60)
    
    working = sum(results.values())
    total = len(results)
    
    print(f"✅ Working Components: {working}/{total}")
    print(f"❌ Broken Components: {total - working}/{total}")
    
    if working == total:
        print("\n🎉 ALL SYSTEMS OPERATIONAL!")
        print("Your AI-powered POS is ready for production!")
    elif working >= total * 0.8:
        print("\n⚠️  MOSTLY WORKING - Minor issues detected")
        print("System is functional but needs some fixes")
    else:
        print("\n❌ CRITICAL ISSUES DETECTED")
        print("System needs significant fixes before production")
    
    print("\n🔗 Access Your System:")
    print("- Frontend: http://localhost:3000")
    print("- Backend API: http://localhost:8005")
    print("- Test Accounts: Use any franchise account to login")

if __name__ == "__main__":
    main() 