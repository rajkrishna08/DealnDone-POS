"""
Master Orchestrator AI for Deal n Done POS
Coordinates sub-agents to build, test, and deploy features
"""

import json
import sqlite3
from datetime import datetime
from typing import Dict, List, Any
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MasterOrchestrator:
    """Master Orchestrator AI - Coordinates sub-agents"""
    
    def __init__(self):
        self.sub_agents = {
            "backend-engineer": {
                "role": "Builds FastAPI endpoints, DB logic",
                "keywords": ["API", "endpoint", "database", "logic", "backend"],
                "file": "backend/main.py"
            },
            "frontend-specialist": {
                "role": "Creates React UI with Tailwind",
                "keywords": ["UI", "component", "dashboard", "landing", "frontend"],
                "file": "frontend/src/components/"
            },
            "security-auditor": {
                "role": "Adds MFA, RBAC, encryption, audit logs",
                "keywords": ["security", "JWT", "MFA", "encryption", "audit"],
                "file": "backend/security.py"
            },
            "qa-engineer": {
                "role": "Writes tests, checks edge cases",
                "keywords": ["test", "validation", "edge case", "quality"],
                "file": "backend/test_*.py"
            },
            "performance-optimizer": {
                "role": "Optimizes speed, caching, queries",
                "keywords": ["performance", "cache", "optimize", "speed"],
                "file": "backend/cache.py"
            },
            "mcp-server-builder": {
                "role": "Exposes AI tools via MCP",
                "keywords": ["MCP", "AI", "tools", "resources"],
                "file": "backend/main.py"
            },
            "dealbot-ai": {
                "role": "Your AI assistant that uses MCP",
                "keywords": ["chat", "assistant", "AI", "help"],
                "file": "backend/dealbot.py"
            }
        }
        
        self.audit_db = "dealndone.db"
    
    def assign_task(self, task: str) -> str:
        """Assign task to the best sub-agent based on keywords"""
        task_lower = task.lower()
        
        best_match = None
        best_score = 0
        
        for agent, config in self.sub_agents.items():
            score = sum(1 for keyword in config["keywords"] 
                       if keyword.lower() in task_lower)
            if score > best_score:
                best_score = score
                best_match = agent
        
        return best_match or "frontend-specialist"
    
    def create_delegation_plan(self, goal: str) -> List[Dict[str, Any]]:
        """Break down a goal into subtasks and assign them"""
        
        if "MCP Dashboard" in goal:
            return [
                {
                    "task": "Create MCPDashboard.jsx with AI action logs and health status",
                    "agent": "frontend-specialist",
                    "prompt": "Generate a React component with Tailwind that shows AI actions and MCP health",
                    "file": "frontend/src/components/MCPDashboard.jsx"
                },
                {
                    "task": "Add JWT validation to MCP endpoints",
                    "agent": "security-auditor",
                    "prompt": "Ensure all MCP endpoints validate JWT and check org ownership",
                    "file": "backend/main.py"
                },
                {
                    "task": "Write Pytest cases for MCP Dashboard XSS and auth",
                    "agent": "qa-engineer",
                    "prompt": "Test MCP Dashboard for XSS, SQLi, and unauthorized access",
                    "file": "backend/test_mcp_security.py"
                }
            ]
        
        elif "Signup Flow" in goal:
            return [
                {
                    "task": "Design landing page with real-time subdomain preview",
                    "agent": "frontend-specialist",
                    "prompt": "Create a modern landing page with plan cards and subdomain preview",
                    "file": "frontend/src/components/LandingPage.jsx"
                },
                {
                    "task": "Build /api/auth/signup endpoint",
                    "agent": "backend-engineer",
                    "prompt": "Create FastAPI endpoint that validates input and creates org/user",
                    "file": "backend/main.py"
                }
            ]
        
        elif "DealBot AI" in goal:
            return [
                {
                    "task": "Enhance DealBot to use MCP endpoints",
                    "agent": "dealbot-ai",
                    "prompt": "Update DealBot to call MCP tools for actions like create outlet",
                    "file": "backend/main.py"
                },
                {
                    "task": "Add natural language processing to DealBot",
                    "agent": "dealbot-ai",
                    "prompt": "Improve DealBot's understanding of user requests",
                    "file": "backend/dealbot.py"
                }
            ]
        
        return []
    
    def log_orchestration_action(self, action: str, details: Dict[str, Any]):
        """Log orchestration actions to audit database"""
        try:
            conn = sqlite3.connect(self.audit_db)
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO audit_logs (action, details, timestamp, user_id, org_id)
                VALUES (?, ?, ?, ?, ?)
            ''', (
                f"orchestrator_{action}",
                json.dumps(details),
                datetime.now().isoformat(),
                "orchestrator_ai",
                "system"
            ))
            
            conn.commit()
            conn.close()
            logger.info(f"Orchestrator action logged: {action}")
            
        except Exception as e:
            logger.error(f"Failed to log orchestration action: {e}")
    
    def execute_plan(self, goal: str) -> Dict[str, Any]:
        """Execute a delegation plan for a given goal"""
        
        # Create plan
        plan = self.create_delegation_plan(goal)
        
        # Log the orchestration
        self.log_orchestration_action("plan_created", {
            "goal": goal,
            "tasks": len(plan),
            "agents": list(set(task["agent"] for task in plan))
        })
        
        results = []
        for task in plan:
            # Simulate task execution
            result = {
                "task": task["task"],
                "agent": task["agent"],
                "status": "assigned",
                "prompt": task["prompt"],
                "file": task["file"],
                "timestamp": datetime.now().isoformat()
            }
            results.append(result)
            
            # Log each task assignment
            self.log_orchestration_action("task_assigned", {
                "task": task["task"],
                "agent": task["agent"],
                "file": task["file"]
            })
        
        return {
            "goal": goal,
            "plan": plan,
            "results": results,
            "status": "executed",
            "timestamp": datetime.now().isoformat()
        }

# Global orchestrator instance
orchestrator = MasterOrchestrator()

def get_orchestrator():
    """Get the global orchestrator instance"""
    return orchestrator 