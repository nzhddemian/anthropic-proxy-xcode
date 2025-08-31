# Deploy Anthropic Proxy for Xcode

## Option 1: Render (Free)

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New Web Service"
4. Connect your GitHub repo
5. Set:
   - Name: `anthropic-proxy`
   - Environment: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python anthropic-proxy.py`

## Option 2: Railway (Free)

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"
4. Choose "Deploy from GitHub repo"
5. Select your repo
6. Railway auto-detects Python

## After Deployment

Use the HTTPS URL in Xcode:
- URL: `https://your-app-name.onrender.com/v1/messages` (or Railway URL)
- API Key: Your Anthropic API key
- API Key Header: `x-api-key`
- Description: `Claude via Proxy`

## Test Locally First

```bash
pip install -r requirements.txt
python anthropic-proxy.py
curl http://localhost:3000/v1/models
```
