from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any, Optional
import sqlite3
from datetime import datetime
import uuid

router = APIRouter(prefix="/franchise", tags=["franchise"])

class FranchiseCreateRequest(BaseModel):
    store_name: str
    business_type: str
    franchise_role: str = "franchisee"
    parent_org_id: Optional[str] = None
    royalty_rate: float = 5.0
    territory: Optional[str] = None

class RoyaltyCalculationRequest(BaseModel):
    org_id: str
    period_start: str
    period_end: str
    revenue: float
    expenses: float

class PerformanceReportRequest(BaseModel):
    org_id: str
    report_type: str  # "monthly", "quarterly", "annual"
    include_comparison: bool = True

def get_db():
    conn = sqlite3.connect("dealndone.db")
    conn.row_factory = sqlite3.Row
    return conn

@router.post("/create")
async def create_franchise(request: FranchiseCreateRequest):
    """Create a new franchise outlet with MCP integration"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Generate franchise ID
        franchise_id = f"franchise_{uuid.uuid4().hex[:8]}"
        
        # Create organization with franchise role
        cursor.execute("""
            INSERT INTO organizations (id, store_name, business_type, plan_type, franchise_role, parent_org_id, royalty_rate)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (franchise_id, request.store_name, request.business_type, "franchise", 
              request.franchise_role, request.parent_org_id, request.royalty_rate))
        
        # Create franchise settings
        cursor.execute("""
            INSERT INTO organization_settings (org_id, key, value, description)
            VALUES (?, 'franchise_territory', ?, 'Franchise territory assignment'),
                   (?, 'franchise_start_date', ?, 'Franchise start date'),
                   (?, 'royalty_rate', ?, 'Franchise royalty rate')
        """, (franchise_id, request.territory, franchise_id, 
              datetime.now().isoformat(), franchise_id, str(request.royalty_rate)))
        
        conn.commit()
        conn.close()
        
        return {
            "success": True,
            "franchise_id": franchise_id,
            "message": f"Franchise '{request.store_name}' created successfully",
            "mcp_action": "franchise_created",
            "details": {
                "store_name": request.store_name,
                "franchise_role": request.franchise_role,
                "royalty_rate": request.royalty_rate
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create franchise: {str(e)}")

@router.get("/royalty-calc")
async def calculate_royalty(request: RoyaltyCalculationRequest):
    """Calculate franchise royalties with MCP integration"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Get franchise details
        cursor.execute("""
            SELECT franchise_role, royalty_rate, parent_org_id
            FROM organizations 
            WHERE id = ?
        """, (request.org_id,))
        
        franchise_data = cursor.fetchone()
        if not franchise_data:
            raise HTTPException(status_code=404, detail="Franchise not found")
        
        # Calculate net revenue
        net_revenue = request.revenue - request.expenses
        
        # Calculate royalty (simplified calculation)
        royalty_amount = net_revenue * (franchise_data['royalty_rate'] / 100)
        
        # Log royalty calculation
        cursor.execute("""
            INSERT INTO audit_logs (org_id, action, resource_type, resource_id, details, success, timestamp)
            VALUES (?, 'royalty_calculation', 'franchise', ?, ?, 1, ?)
        """, (request.org_id, request.org_id, 
              f"Revenue: {request.revenue}, Expenses: {request.expenses}, Royalty: {royalty_amount}",
              datetime.now().isoformat()))
        
        conn.commit()
        conn.close()
        
        return {
            "success": True,
            "franchise_id": request.org_id,
            "period": {
                "start": request.period_start,
                "end": request.period_end
            },
            "calculations": {
                "gross_revenue": request.revenue,
                "expenses": request.expenses,
                "net_revenue": net_revenue,
                "royalty_rate": franchise_data['royalty_rate'],
                "royalty_amount": royalty_amount
            },
            "mcp_action": "royalty_calculated",
            "details": {
                "franchise_role": franchise_data['franchise_role'],
                "parent_org_id": franchise_data['parent_org_id']
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to calculate royalty: {str(e)}")

@router.post("/performance-report")
async def generate_performance_report(request: PerformanceReportRequest):
    """Generate franchise performance report with MCP integration"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Get franchise performance data
        cursor.execute("""
            SELECT 
                o.store_name,
                o.franchise_role,
                o.royalty_rate,
                COUNT(DISTINCT s.id) as total_sales,
                SUM(s.total) as total_revenue,
                AVG(s.total) as avg_sale_value
            FROM organizations o
            LEFT JOIN sales s ON o.id = s.org_id
            WHERE o.id = ?
            GROUP BY o.id
        """, (request.org_id,))
        
        performance_data = cursor.fetchone()
        if not performance_data:
            raise HTTPException(status_code=404, detail="Franchise not found")
        
        # Generate report
        report = {
            "franchise_id": request.org_id,
            "store_name": performance_data['store_name'],
            "franchise_role": performance_data['franchise_role'],
            "report_type": request.report_type,
            "performance_metrics": {
                "total_sales": performance_data['total_sales'] or 0,
                "total_revenue": performance_data['total_revenue'] or 0,
                "avg_sale_value": performance_data['avg_sale_value'] or 0,
                "royalty_rate": performance_data['royalty_rate']
            },
            "generated_at": datetime.now().isoformat(),
            "mcp_action": "performance_report_generated"
        }
        
        # Log report generation
        cursor.execute("""
            INSERT INTO audit_logs (org_id, action, resource_type, resource_id, details, success, timestamp)
            VALUES (?, 'performance_report', 'franchise', ?, ?, 1, ?)
        """, (request.org_id, request.org_id, 
              f"Report type: {request.report_type}, Include comparison: {request.include_comparison}",
              datetime.now().isoformat()))
        
        conn.commit()
        conn.close()
        
        return report
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate performance report: {str(e)}")

@router.get("/list")
async def list_franchises(parent_org_id: Optional[str] = None):
    """List all franchises with optional parent filtering"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        if parent_org_id:
            cursor.execute("""
                SELECT id, store_name, business_type, franchise_role, royalty_rate, created_at
                FROM organizations 
                WHERE parent_org_id = ? AND franchise_role IN ('franchisee', 'franchisor')
                ORDER BY created_at DESC
            """, (parent_org_id,))
        else:
            cursor.execute("""
                SELECT id, store_name, business_type, franchise_role, royalty_rate, created_at
                FROM organizations 
                WHERE franchise_role IN ('franchisee', 'franchisor')
                ORDER BY created_at DESC
            """)
        
        franchises = cursor.fetchall()
        conn.close()
        
        return {
            "success": True,
            "franchises": [
                {
                    "id": f['id'],
                    "store_name": f['store_name'],
                    "business_type": f['business_type'],
                    "franchise_role": f['franchise_role'],
                    "royalty_rate": f['royalty_rate'],
                    "created_at": f['created_at']
                }
                for f in franchises
            ],
            "total_count": len(franchises)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list franchises: {str(e)}")

# MCP Integration for Franchise Management
@router.get("/mcp/resources/franchise/{org_id}")
async def mcp_franchise_resource(org_id: str):
    """MCP Resource: Get franchise information"""
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT id, store_name, business_type, franchise_role, royalty_rate, parent_org_id, created_at
            FROM organizations 
            WHERE id = ?
        """, (org_id,))
        
        franchise_data = cursor.fetchone()
        conn.close()
        
        if not franchise_data:
            raise HTTPException(status_code=404, detail="Franchise not found")
        
        return {
            "resource_type": "franchise",
            "resource_id": org_id,
            "data": {
                "store_name": franchise_data['store_name'],
                "business_type": franchise_data['business_type'],
                "franchise_role": franchise_data['franchise_role'],
                "royalty_rate": franchise_data['royalty_rate'],
                "parent_org_id": franchise_data['parent_org_id'],
                "created_at": franchise_data['created_at']
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get franchise resource: {str(e)}")

@router.post("/mcp/tools/create-franchise")
async def mcp_create_franchise_tool(request: FranchiseCreateRequest):
    """MCP Tool: Create franchise outlet via AI"""
    try:
        # Use the existing create_franchise logic
        result = await create_franchise(request)
        
        # Add MCP-specific response
        result["mcp_tool"] = "create_franchise"
        result["ai_action"] = True
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"MCP tool failed: {str(e)}") 