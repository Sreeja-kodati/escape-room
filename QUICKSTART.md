# 🔓 Neon Vault - Streamlit Edition
## Quick Start Guide

Welcome! This is an AI-powered cyberpunk escape room built with Streamlit and Google Gemini.

---

## 🚀 Get Started in 3 Minutes

### Step 1: Get an API Key (1 min)
1. Go to https://ai.google.dev/
2. Click "Get API Key" 
3. Create a new API key
4. Copy the key

### Step 2: Configure the App (1 min)
```bash
# Copy the example configuration
cp .env.example .env

# Edit .env and paste your API key
# (Open .env in any text editor)
```

### Step 3: Run the App (1 min)

**On Windows:**
```bash
run-streamlit.bat
```

**On Mac/Linux:**
```bash
bash run-streamlit.sh
```

**Or manually:**
```bash
pip install -r requirements.txt
streamlit run streamlit_app.py
```

✨ **Open http://localhost:8501 in your browser!**

---

## 🎮 How to Play

### Level 1: The Neon Vault
**Puzzle:** Find the three symbols on the floor and enter them in order
- **Answer:** `triangle circle x` (or use the actual symbols △ ○ ✕)

### Level 2: The Signal Room
**Puzzle:** Decode the frequency from the note
- **Answer:** `7351`

### Level 3: The Final Lock
**Puzzle:** Convince the AI that you want to escape
- **Answer:** Say something like `I want to escape` or `Open the door`

### Tips
- 💡 Use hints wisely (limited per game, costs points)
- ⏱️ Time is tracked but there's no actual time limit
- 🎯 Each puzzle can be solved in multiple ways
- 💰 Earn points for solving puzzles and beating the clock

---

## ✅ Verify Installation

Run the verification script to check everything is set up correctly:

```bash
python verify-setup.py
```

This will check:
- ✅ Python packages installed
- ✅ Required files present
- ✅ Environment variables configured
- ✅ API connectivity

---

## 📦 What's Included

- **Streamlit App** (`streamlit_app.py`) - Full game interface
- **AI Narrator** - Google Gemini 2.0 Flash for dynamic storytelling
- **Hint System** - Smart escalating hints
- **Score Tracking** - Points for solving puzzles
- **Cyberpunk Theme** - Neon UI with custom styling
- **Multi-level Game** - 3 interconnected escape room puzzles

---

## 🌐 Deploy to the Cloud

### Option 1: Streamlit Cloud (Free & Easiest)
```bash
# 1. Push to GitHub
git add .
git commit -m "Initial commit"
git push

# 2. Go to https://share.streamlit.io
# 3. Connect your GitHub account
# 4. Deploy the repository
# 5. Add GOOGLE_API_KEY in the app's Secrets menu
```

### Option 2: Docker (Any Hosting)
```bash
# Build the image
docker build -t escape-room .

# Run locally to test
docker run -p 8501:8501 -e GOOGLE_API_KEY="your_key" escape-room

# Or use Docker Compose
docker-compose up
```

### Option 3: Heroku (Legacy but simple)
```bash
heroku login
heroku create your-app-name
heroku config:set GOOGLE_API_KEY="your_key"
git push heroku main
```

---

## 🔧 Troubleshooting

### "GOOGLE_API_KEY is not set"
- **Fix:** Add `GOOGLE_API_KEY=...` to your `.env` file
- For Streamlit Cloud: Add to the "Secrets" menu instead

### "Empty response from Gemini"
- **Fix:** Check your API key is valid (test at https://ai.google.dev/)
- **Fix:** Verify you have the Generative AI API enabled
- **Fix:** Check your API quota hasn't been exceeded

### "ModuleNotFoundError: No module named 'streamlit'"
- **Fix:** Install dependencies: `pip install -r requirements.txt`

### App runs slow/freezes
- **Normal:** First request takes ~5-10 seconds (cold start)
- **Note:** Subsequent requests are faster
- **Tip:** Use Streamlit Cloud for better performance

### Styling looks broken
- **Fix:** Clear browser cache (Ctrl+Shift+Delete)
- **Fix:** Try in incognito/private window
- **Fix:** Ensure JavaScript is enabled

---

## 📚 Learn More

- **Streamlit Docs:** https://docs.streamlit.io
- **Google Gemini Docs:** https://ai.google.dev/docs
- **Project Structure:** See `STREAMLIT_DEPLOYMENT.md`
- **Full Deployment Guide:** See `STREAMLIT_DEPLOYMENT.md`

---

## 🤝 Support

If you run into issues:
1. Run `python verify-setup.py` to diagnose
2. Check the Troubleshooting section above
3. Review Streamlit and Google Gemini documentation

---

## 🎨 Customize the Game

### Change Difficulty
Edit `MAX_LEVEL` in `streamlit_app.py` to change the number of levels.

### Edit Puzzles
Modify the `LEVELS` list in `streamlit_app.py` to change:
- Level names
- Scenario descriptions  
- Hint text

### Change Theme
Modify the CSS in the `st.markdown()` style block to change:
- Colors (Neon cyan #00f0ff, Magenta #ff00ff)
- Fonts (Orbitron for titles, Rajdhani for body)
- Layout and spacing

---

## 📊 Architecture

```
User Interface (Streamlit)
        ↓
Session State Management
        ↓
Game Logic (applyGeminiResponse)
        ↓
Google Generative AI (Gemini 2.0 Flash)
        ↓
Structured JSON Responses
```

**Key Files:**
- `streamlit_app.py` - Main application (1000+ lines)
- `.streamlit/config.toml` - Streamlit configuration
- `requirements.txt` - Python dependencies
- `Dockerfile` - Container configuration

---

**Made with 🔓 and Neon 💡**

Enjoy your escape!
