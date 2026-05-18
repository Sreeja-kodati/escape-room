# 🔓 Neon Vault - Streamlit Deployment Guide

## Quick Start (Local)

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Set Environment Variables
Create a `.env` file in the project root:
```
GOOGLE_API_KEY=your_google_generative_ai_api_key_here
```

Get your API key from: https://ai.google.dev/

### 3. Run Streamlit App
```bash
streamlit run streamlit_app.py
```

The app will open at `http://localhost:8501`

---

## Deploy to Streamlit Cloud

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/escape-room.git
git push -u origin main
```

### 2. Connect to Streamlit Cloud
1. Go to https://share.streamlit.io
2. Click "New app"
3. Select your repository
4. Select branch: `main`
5. Select file path: `streamlit_app.py`
6. Click "Deploy"

### 3. Add Secrets
In Streamlit Cloud dashboard:
1. Click your app's menu (⋮)
2. Select "Secrets"
3. Add the secret:
```
GOOGLE_API_KEY = "your_google_generative_ai_api_key_here"
```

### 4. Redeploy
Click "Rerun" or push a new commit to GitHub

---

## Deploy to Other Platforms

### Heroku
```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Add buildpack for Python
heroku buildpacks:add heroku/python

# Set environment variables
heroku config:set GOOGLE_API_KEY="your_key_here"

# Deploy
git push heroku main
```

### Railway.app
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Init project
railway init

# Set environment variables
railway variables --set GOOGLE_API_KEY="your_key_here"

# Deploy
railway up
```

### Docker (Any Platform)
```bash
# Build image
docker build -t escape-room .

# Run locally
docker run -p 8501:8501 -e GOOGLE_API_KEY="your_key" escape-room

# Push to registry and deploy to cloud
docker push your-registry/escape-room
```

---

## Verify Installation

After deployment, test the app by:
1. Opening the deployed URL
2. Clicking "START GAME"
3. Entering a puzzle attempt (try "triangle circle x" for level 1)
4. Using the hint system
5. Testing level progression

---

## Troubleshooting

### "GOOGLE_API_KEY is not set"
- Local: Add `GOOGLE_API_KEY` to `.env` file
- Streamlit Cloud: Add to Secrets
- Docker: Use `-e GOOGLE_API_KEY="..."` flag

### "Empty response from Gemini"
- Check your API key is valid
- Verify you have Google Generative AI API enabled
- Check your API quota/rate limits

### Slow responses
- This is normal for first request (cold start)
- Consider caching with `@st.cache_resource`
- The app already implements caching for the Gemini client

### Styling looks wrong
- Clear browser cache (Ctrl+Shift+Delete)
- Try incognito/private window
- Ensure JavaScript is enabled

---

## Project Structure

```
escape-room/
├── streamlit_app.py          # Main Streamlit app
├── app.py                    # Streamlit launcher script
├── requirements.txt          # Python dependencies
├── .env.example             # Example environment file
├── .streamlit/
│   └── config.toml          # Streamlit config
├── server/
│   ├── index.ts             # Express server (unused in Streamlit)
│   ├── gameLogic.ts         # Game logic (TypeScript)
│   ├── gemini.ts            # Gemini integration
│   └── prompts.ts           # Prompt templates
├── src/
│   ├── App.tsx              # React app (unused in Streamlit)
│   └── ...                  # Other React files
└── README.md
```

---

## Performance Optimization

The Streamlit app includes optimizations:
- **Cached Gemini Client**: `@st.cache_resource` prevents re-initialization
- **Session State**: Game state persists across interactions
- **Selective Reruns**: Minimal `st.rerun()` calls
- **JSON Response Format**: Forces structured responses from Gemini

---

## Features

✅ **Multi-level Escape Room**: 3 cyberpunk-themed levels
✅ **AI Narrator**: Powered by Google Gemini 2.0 Flash
✅ **Hint System**: Escalating hints with score penalty
✅ **Score Tracking**: Points for solving puzzles
✅ **Responsive Design**: Works on desktop and mobile
✅ **Cyberpunk Theme**: Neon UI with custom styling
✅ **Level Progression**: Auto-advance on puzzle solve
✅ **Win Condition**: Complete all 3 levels to escape

---

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review Streamlit docs: https://docs.streamlit.io
3. Check Gemini API docs: https://ai.google.dev/docs
