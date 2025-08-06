# 🛠️ **DealNDone 2025 - DevOps Setup Guide**
## **Azure DevOps & GitHub Actions Integration**

---

## 📋 **Table of Contents**
1. [Azure DevOps Organization Setup](#azure-devops-organization-setup)
2. [GitHub Repository Integration](#github-repository-integration)
3. [RBAC Role Matrix](#rbac-role-matrix)
4. [Team Onboarding](#team-onboarding)
5. [Pipeline Simplicity Charter](#pipeline-simplicity-charter)
6. [Cost Management](#cost-management)
7. [Security & Compliance](#security--compliance)

---

## 🏢 **Azure DevOps Organization Setup**

### **Step 1: Create Azure DevOps Organization**
```bash
# Using Azure CLI
az devops configure --defaults organization=https://dev.azure.com/dealndone2025
az devops configure --defaults project=DealNDone2025

# Create organization
az devops project create \
  --name "DealNDone2025" \
  --description "Enterprise Omnichannel SaaS POS System" \
  --visibility private \
  --source-control git
```

### **Step 2: Configure GitHub Integration**
```bash
# Install GitHub App for Azure DevOps
# Navigate to: https://dev.azure.com/dealndone2025/_settings/boards
# Add GitHub connection with PAT or GitHub App
```

### **Step 3: Set Up Service Connections**
```yaml
# Azure Container Registry Connection
Name: dealndone-acr-connection
Type: Docker Registry
URL: dealndone2025.azurecr.io
Username: ${{ secrets.AZURE_REGISTRY_USERNAME }}
Password: ${{ secrets.AZURE_REGISTRY_PASSWORD }}

# Azure Subscription Connection
Name: DealNDone-Azure-Subscription
Type: Azure Resource Manager
Subscription: DealNDone Production Subscription
```

---

## 🔗 **GitHub Repository Integration**

### **Step 1: Link Repository to Azure DevOps**
```bash
# In Azure DevOps Project Settings
# Navigate to: Repos > Import Repository
# Select GitHub as source
# Repository: dealndone2025/dealndone2025
# Import all branches and tags
```

### **Step 2: Configure Webhooks**
```yaml
# GitHub Webhook Configuration
URL: https://dev.azure.com/dealndone2025/_apis/public/distributedtask/webhooks
Events:
  - push
  - pull_request
  - issues
  - releases
```

### **Step 3: Set Up Branch Policies**
```yaml
# Main Branch Protection
Required reviewers: 2
Required status checks:
  - Code Quality
  - Security Scan
  - Build & Test
  - Deploy Staging
```

---

## 👥 **RBAC Role Matrix**

### **Pipeline Administrator**
```yaml
Permissions:
  - Edit pipelines
  - Manage pipeline permissions
  - Approve deployments
  - Manage environments
  - View build logs
  - Manage service connections

Members:
  - DevOps Lead
  - Tech Lead
  - Security Admin
```

### **Pipeline Contributor**
```yaml
Permissions:
  - View pipelines
  - Queue builds
  - View build logs
  - View test results
  - View code coverage

Members:
  - Senior Developers
  - QA Engineers
  - Release Managers
```

### **Pipeline Reader**
```yaml
Permissions:
  - View pipelines
  - View build logs
  - View test results
  - View deployment status

Members:
  - Junior Developers
  - Product Managers
  - Business Analysts
```

### **Environment Approver**
```yaml
Permissions:
  - Approve deployments to production
  - View deployment logs
  - Manage environment variables

Members:
  - DevOps Lead
  - Tech Lead
  - Security Admin
```

---

## 🚀 **Team Onboarding**

### **Step 1: Invite Team Members**
```powershell
# PowerShell script to bulk invite team members
$teamMembers = @(
    @{Name="DevOps Lead"; Email="devops@dealndone.com"; Role="Pipeline Administrator"},
    @{Name="Tech Lead"; Email="tech@dealndone.com"; Role="Pipeline Administrator"},
    @{Name="Senior Dev 1"; Email="dev1@dealndone.com"; Role="Pipeline Contributor"},
    @{Name="Senior Dev 2"; Email="dev2@dealndone.com"; Role="Pipeline Contributor"},
    @{Name="QA Engineer"; Email="qa@dealndone.com"; Role="Pipeline Contributor"}
)

foreach ($member in $teamMembers) {
    az devops security group membership add \
        --group-id "Pipeline $($member.Role)" \
        --member-id $member.Email
}
```

### **Step 2: MFA Enforcement**
```yaml
# Azure AD MFA Policy
Policy Name: DealNDone DevOps MFA
Scope: All users accessing Azure DevOps
Requirements:
  - MFA for all sign-ins
  - Conditional access based on location
  - Risk-based authentication
```

### **Step 3: Training Checklist**
- [ ] Azure DevOps navigation
- [ ] Pipeline execution and monitoring
- [ ] Work item management
- [ ] Code review process
- [ ] Deployment approval workflow
- [ ] Security best practices

---

## 📋 **Pipeline Simplicity Charter**

### **Rule 1: Maximum 3 Stages**
```yaml
# Allowed Stages:
1. Quality Gates & Security
2. Build & Test
3. Deploy (Staging/Production)

# Exception: M4 approval required for additional stages
```

### **Rule 2: No Nested Scripts**
```yaml
# ✅ Good: Use task templates
- template: security-scan.yml
- template: build-app.yml
- template: deploy-app.yml

# ❌ Bad: Inline complex scripts
- script: |
    complex logic here
    nested conditions
    multiple functions
```

### **Rule 3: Reusable Templates**
```yaml
# Create templates for common tasks
templates/
├── security-scan.yml
├── build-app.yml
├── deploy-app.yml
├── health-check.yml
└── notifications.yml
```

### **Rule 4: Fail Fast**
```yaml
# Quality gates must pass before proceeding
conditions:
  - succeeded()
  - and(succeeded(), eq(variables['QualityScore'], '>=80'))
  - and(succeeded(), eq(variables['SecurityIssues'], '<=5'))
```

### **Rule 5: Deployment Time Limits**
```yaml
# Maximum deployment times
Staging: 10 minutes
Production: 15 minutes
Rollback: 5 minutes
```

---

## 💰 **Cost Management**

### **Azure DevOps Pricing Tiers**

| Tier | Users | CI/CD Minutes | Cost | Features |
|------|-------|---------------|------|----------|
| **Free** | 5 | 1,800/month | $0 | Basic pipelines, Git repos |
| **Basic** | Unlimited | 3,600/month | $6/user/month | Advanced pipelines, work items |
| **Premium** | Unlimited | Unlimited | $52/user/month | Advanced features, compliance |

### **Current Setup (Free Tier)**
```yaml
# Free Tier Configuration
Users: 5 core team members
CI/CD Minutes: 1,800/month (sufficient for current needs)
Cost: $0/month
Features: All essential DevOps features
```

### **Upgrade Path to Premium**
```yaml
# When to upgrade (M4 criteria):
- Team size > 10 developers
- CI/CD minutes > 3,600/month
- Need advanced compliance features
- Require unlimited parallel jobs

# Upgrade cost: $52/user/month
# Example: 15 users = $780/month
```

### **Cost Optimization Strategies**
```yaml
# Strategies to stay on free tier:
1. Use GitHub Actions for CI/CD (free for public repos)
2. Optimize pipeline execution time
3. Use self-hosted runners for heavy builds
4. Implement parallel job limits
5. Cache dependencies aggressively
```

---

## 🔐 **Security & Compliance**

### **Access Control**
```yaml
# Azure DevOps Security
Authentication: Azure AD + MFA
Authorization: Role-based access control
Audit Logging: All actions logged
Session Management: 8-hour timeout
```

### **Pipeline Security**
```yaml
# Security Measures:
1. Secrets stored in Azure Key Vault
2. Service connections with least privilege
3. Environment protection rules
4. Deployment approvals required
5. Code signing for releases
```

### **Compliance Features**
```yaml
# Available in Premium Tier:
- Compliance reporting
- Audit trail retention
- Policy enforcement
- Security scanning integration
- Vulnerability management
```

---

## 📊 **Monitoring & Reporting**

### **Pipeline Metrics**
```yaml
# Key Performance Indicators:
- Build success rate: >95%
- Deployment time: <15 minutes
- Test coverage: >80%
- Security issues: <5 per build
- Code quality score: >85
```

### **Reporting Dashboard**
```yaml
# Azure DevOps Dashboards:
1. Pipeline Health Overview
2. Deployment Status
3. Quality Metrics
4. Security Scan Results
5. Team Velocity
```

---

## 🚀 **Quick Start Commands**

### **Setup Azure DevOps**
```bash
# Install Azure CLI
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Login to Azure
az login

# Create DevOps organization
az devops configure --defaults organization=https://dev.azure.com/dealndone2025
az devops project create --name DealNDone2025 --visibility private
```

### **Link GitHub Repository**
```bash
# In Azure DevOps portal:
# 1. Go to Project Settings > Repos
# 2. Click "Import Repository"
# 3. Select GitHub
# 4. Authorize with GitHub App
# 5. Select dealndone2025/dealndone2025
```

### **Configure Pipeline**
```bash
# Import pipeline from GitHub
# 1. Go to Pipelines > New Pipeline
# 2. Select "GitHub" as source
# 3. Select dealndone2025 repository
# 4. Choose "Existing Azure Pipelines YAML file"
# 5. Select azure-pipelines.yml
```

---

## ✅ **Implementation Checklist**

### **Phase 1: Foundation (Week 1)**
- [ ] Create Azure DevOps organization
- [ ] Set up GitHub integration
- [ ] Configure service connections
- [ ] Create RBAC roles
- [ ] Invite core team members

### **Phase 2: Pipeline Setup (Week 2)**
- [ ] Import GitHub repository
- [ ] Configure Azure pipelines
- [ ] Set up environments (staging/production)
- [ ] Configure branch policies
- [ ] Test pipeline execution

### **Phase 3: Security & Compliance (Week 3)**
- [ ] Enable MFA for all users
- [ ] Configure audit logging
- [ ] Set up security scanning
- [ ] Implement deployment approvals
- [ ] Create compliance reports

### **Phase 4: Optimization (Week 4)**
- [ ] Optimize pipeline performance
- [ ] Implement caching strategies
- [ ] Set up monitoring dashboards
- [ ] Create team training materials
- [ ] Document runbooks

---

## 📞 **Support & Documentation**

### **Useful Links**
- [Azure DevOps Documentation](https://docs.microsoft.com/en-us/azure/devops/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Azure Container Apps Documentation](https://docs.microsoft.com/en-us/azure/container-apps/)

### **Contact Information**
- **DevOps Lead**: devops@dealndone.com
- **Tech Lead**: tech@dealndone.com
- **Security Admin**: security@dealndone.com

### **Emergency Contacts**
- **Azure Support**: Available with Azure subscription
- **GitHub Support**: Available for GitHub issues
- **Internal Escalation**: DevOps Lead → Tech Lead → CTO

---

*Last Updated: August 4, 2025*
*Version: 1.0*
*Status: ✅ Ready for Implementation* 