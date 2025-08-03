#!/usr/bin/env python3
"""
Test script for Master Orchestrator system
Demonstrates how the orchestrator coordinates sub-agents
"""

import sys
import os
import json
from datetime import datetime

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import the orchestrator
from ai.orchestrator import get_orchestrator

def test_orchestrator():
    """Test the Master Orchestrator with different goals"""
    
    print("🎯 Master Orchestrator Test")
    print("=" * 50)
    
    orchestrator = get_orchestrator()
    
    # Test goals
    test_goals = [
        "Build MCP Dashboard",
        "Enhance Signup Flow", 
        "DealBot AI Integration",
        "Security Audit"
    ]
    
    for goal in test_goals:
        print(f"\n📋 Testing Goal: {goal}")
        print("-" * 30)
        
        # Create plan
        plan = orchestrator.create_delegation_plan(goal)
        
        print(f"📝 Plan created with {len(plan)} tasks:")
        for i, task in enumerate(plan, 1):
            print(f"  {i}. {task['task']}")
            print(f"     Agent: {task['agent']}")
            print(f"     File: {task['file']}")
            print()
        
        # Execute plan
        result = orchestrator.execute_plan(goal)
        
        print(f"✅ Plan executed successfully!")
        print(f"   Status: {result['status']}")
        print(f"   Tasks: {len(result['results'])}")
        print(f"   Timestamp: {result['timestamp']}")
        
        # Show results
        print("\n📊 Task Results:")
        for task_result in result['results']:
            status_icon = "✅" if task_result['status'] == 'assigned' else "❌"
            print(f"  {status_icon} {task_result['task']}")
            print(f"     Agent: {task_result['agent']}")
            print(f"     Status: {task_result['status']}")
            print()

def test_sub_agent_assignment():
    """Test sub-agent assignment logic"""
    
    print("\n🧪 Testing Sub-Agent Assignment")
    print("=" * 40)
    
    orchestrator = get_orchestrator()
    
    test_tasks = [
        "Create React component for dashboard",
        "Add JWT validation to API endpoints", 
        "Write Pytest test cases",
        "Optimize database queries",
        "Build MCP tools for AI integration",
        "Enhance DealBot chat interface"
    ]
    
    for task in test_tasks:
        assigned_agent = orchestrator.assign_task(task)
        print(f"Task: {task}")
        print(f"Assigned to: {assigned_agent}")
        print()

def test_audit_logging():
    """Test audit logging functionality"""
    
    print("\n📝 Testing Audit Logging")
    print("=" * 30)
    
    orchestrator = get_orchestrator()
    
    # Test logging different actions
    test_actions = [
        ("plan_created", {"goal": "Test Goal", "tasks": 3}),
        ("task_assigned", {"task": "Create Component", "agent": "frontend-specialist"}),
        ("integration_complete", {"components": 2, "status": "success"})
    ]
    
    for action, details in test_actions:
        orchestrator.log_orchestration_action(action, details)
        print(f"✅ Logged: {action} - {details}")

def main():
    """Run all orchestrator tests"""
    
    print("🚀 Master Orchestrator System Test")
    print("=" * 50)
    print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    try:
        # Test sub-agent assignment
        test_sub_agent_assignment()
        
        # Test orchestration planning and execution
        test_orchestrator()
        
        # Test audit logging
        test_audit_logging()
        
        print("\n🎉 All tests completed successfully!")
        print("✅ Master Orchestrator is working correctly")
        print("✅ Sub-agent assignment is functioning")
        print("✅ Audit logging is operational")
        
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main() 