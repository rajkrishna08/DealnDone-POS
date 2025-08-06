# PostgreSQL Installation Guide for Windows

## Option 1: Install PostgreSQL Directly

1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run the installer
3. Set password: dealndone2025
4. Keep default port: 5432
5. Create database: dealndone_dev

## Option 2: Use Chocolatey (if available)

```powershell
choco install postgresql
```

## Option 3: Use WSL2 with Docker

```bash
# Install WSL2
wsl --install

# Install Docker Desktop
# Download from: https://www.docker.com/products/docker-desktop

# Run PostgreSQL in Docker
docker run --name dealndone-postgres \
  -e POSTGRES_DB=dealndone_dev \
  -e POSTGRES_USER=dealndone \
  -e POSTGRES_PASSWORD=dealndone2025 \
  -p 5432:5432 \
  -d postgres:16
```

## Test Connection

After installation, test with:

```python
import psycopg2
conn = psycopg2.connect(
    host='localhost',
    port=5432,
    database='dealndone_dev',
    user='dealndone',
    password='dealndone2025'
)
print("PostgreSQL connected!")
```

## Quick Setup Commands

```bash
# Install PostgreSQL dependencies
pip install psycopg2-binary SQLAlchemy python-dotenv

# Test connection
python -c "import psycopg2; conn = psycopg2.connect(host='localhost', port=5432, database='dealndone_dev', user='dealndone', password='dealndone2025'); print('Connected!')"

# Run migration
python migrate_to_postgresql.py
``` 