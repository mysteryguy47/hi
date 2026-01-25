# Deployment Guide for Talent Hub

## Tech Stack Overview

### Frontend
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 7.3.0
- **Routing**: Wouter 3.3.5
- **State Management**: TanStack Query 5.60.5
- **Styling**: Tailwind CSS 3.4.17
- **Icons**: Lucide React
- **Runtime**: Node.js 20+

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **ASGI Server**: Uvicorn
- **Database**: SQLite (can be upgraded to PostgreSQL)
- **ORM**: SQLAlchemy 2.0+
- **PDF Generation**: Playwright (Chromium)
- **Authentication**: JWT (python-jose)
- **Dependencies**: See `backend/requirements.txt`

### Key Differences
- **Frontend**: JavaScript/TypeScript ecosystem (Node.js, npm)
- **Backend**: Python ecosystem (pip, virtualenv)
- **They are separate** but communicate via REST API (`/api` endpoints)

---

## Deployment Options

### Option 1: Traditional Deployment (No Docker) ⭐ **RECOMMENDED for most hosts**

#### Prerequisites
- Python 3.11+ installed
- Node.js 20+ installed
- Nginx (or Apache) for reverse proxy
- Domain/subdomain configured

#### Steps

**1. Backend Deployment**

```bash
# On your server
cd /path/to/your/project/backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Install Playwright browsers
playwright install chromium
playwright install-deps chromium

# Set environment variables
export DATABASE_URL="sqlite:///./abacus_replitt.db"
# Or for PostgreSQL:
# export DATABASE_URL="postgresql://user:pass@localhost:5432/abacus_replitt"

# Run migrations/init database
python -c "from models import init_db; init_db()"

# Run backend (use process manager like PM2 or systemd)
uvicorn main:app --host 0.0.0.0 --port 8000
```

**2. Frontend Build & Deployment**

```bash
# On your server or build machine
cd /path/to/your/project/frontend

# Install dependencies
npm install

# Build for production
npm run build
# This creates a `dist/` folder with static files

# Copy dist/ folder to your web server
# Example: /var/www/talenthub/
cp -r dist/* /var/www/talenthub/
```

**3. Nginx Configuration (for subdomain: talenthub.yourdomain.com)**

```nginx
# /etc/nginx/sites-available/talenthub
server {
    listen 80;
    server_name talenthub.yourdomain.com;

    # Frontend static files
    root /var/www/talenthub;
    index index.html;

    # Serve frontend
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to backend
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Increase timeout for PDF generation
        proxy_read_timeout 300s;
        proxy_connect_timeout 300s;
    }

    # SSL (Let's Encrypt)
    # listen 443 ssl;
    # ssl_certificate /etc/letsencrypt/live/talenthub.yourdomain.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/talenthub.yourdomain.com/privkey.pem;
}
```

**4. Process Management (PM2 for Node.js, systemd for Python)**

**Backend with systemd:**
```ini
# /etc/systemd/system/talenthub-backend.service
[Unit]
Description=Talent Hub Backend
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/your/project/backend
Environment="PATH=/path/to/your/project/backend/venv/bin"
Environment="DATABASE_URL=sqlite:///./abacus_replitt.db"
ExecStart=/path/to/your/project/backend/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable talenthub-backend
sudo systemctl start talenthub-backend
```

---

### Option 2: Docker Deployment (if host supports Docker)

**1. Build and run with Docker Compose:**

```bash
docker-compose up -d --build
```

**2. Update docker-compose.yml for production:**

```yaml
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=sqlite:////data/abacus_replitt.db
    volumes:
      - ./abacus_replitt.db:/data/abacus_replitt.db
    restart: unless-stopped

  frontend:
    build: 
      context: ./frontend
      dockerfile: Dockerfile.prod  # Create production Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
```

**Create `frontend/Dockerfile.prod`:**
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

### Option 3: Platform-as-a-Service (PaaS) ⭐ **EASIEST**

#### **Recommended: Vercel (Frontend) + Railway/Render (Backend)**

**Frontend on Vercel:**
1. Connect GitHub repo
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_BASE=https://your-backend.railway.app/api`

**Backend on Railway/Render:**
1. Connect GitHub repo
2. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
3. Add environment variable: `DATABASE_URL=sqlite:///./abacus_replitt.db`
4. Railway/Render will auto-detect Python and install dependencies

**Other PaaS Options:**
- **Netlify** (Frontend) + **Fly.io** (Backend)
- **Cloudflare Pages** (Frontend) + **Heroku** (Backend)
- **AWS Amplify** (Frontend) + **AWS Elastic Beanstalk** (Backend)

---

## Best Option for Subdomain Deployment

### **Recommended: Traditional Deployment with Nginx** ⭐

**Why:**
- ✅ Works on any VPS (DigitalOcean, Linode, AWS EC2, etc.)
- ✅ Full control over configuration
- ✅ Cost-effective ($5-10/month)
- ✅ Easy SSL with Let's Encrypt
- ✅ No Docker dependency

**Steps:**

1. **Get a VPS** (DigitalOcean, Linode, AWS EC2, etc.)
2. **Install Nginx, Python 3.11, Node.js 20**
3. **Clone your repository**
4. **Set up backend** (see Option 1 above)
5. **Build and deploy frontend** (see Option 1 above)
6. **Configure Nginx** (see Option 1 above)
7. **Set up SSL** with Let's Encrypt:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d talenthub.yourdomain.com
   ```
8. **Point DNS** to your server IP:
   ```
   A record: talenthub.yourdomain.com → YOUR_SERVER_IP
   ```

---

## Environment Variables

### Frontend (`.env` or build-time)
```bash
VITE_API_BASE=https://talenthub.yourdomain.com/api
# Or relative: VITE_API_BASE=/api (if same domain)
```

### Backend
```bash
DATABASE_URL=sqlite:///./abacus_replitt.db
# Or PostgreSQL: DATABASE_URL=postgresql://user:pass@localhost:5432/abacus_replitt
SECRET_KEY=your-secret-key-here  # For JWT
```

---

## Important Notes

1. **Frontend Build**: The frontend must be built (`npm run build`) before deployment. The `dist/` folder contains static files that can be served by any web server.

2. **API Proxy**: In production, configure your web server (Nginx) to proxy `/*` requests (excluding static assets) to the backend running on port 8000.

3. **CORS**: Ensure backend CORS settings allow your frontend domain:
   ```python
   # In backend/main.py
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["https://talenthub.yourdomain.com"],
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

4. **Database**: SQLite works for small deployments. For production with many users, consider PostgreSQL.

5. **Playwright**: Requires Chromium installation. On servers, ensure all dependencies are installed:
   ```bash
   playwright install-deps chromium
   ```

---

## Quick Start Checklist

- [ ] Server/VPS ready with Python 3.11+ and Node.js 20+
- [ ] Domain/subdomain DNS configured
- [ ] Backend dependencies installed
- [ ] Frontend built (`npm run build`)
- [ ] Nginx configured with reverse proxy
- [ ] SSL certificate installed (Let's Encrypt)
- [ ] Backend running as service (systemd/PM2)
- [ ] Frontend static files served by Nginx
- [ ] Environment variables set
- [ ] Database initialized
- [ ] Test all endpoints

---

## Troubleshooting

**Frontend can't connect to backend:**
- Check Nginx proxy configuration
- Verify backend is running: `curl http://localhost:8000/health`
- Check CORS settings in backend

**PDF generation fails:**
- Ensure Playwright Chromium is installed
- Check server has enough memory (Playwright needs ~500MB)

**Static files not loading:**
- Verify `dist/` folder is in correct location
- Check Nginx `root` directive
- Ensure file permissions are correct
