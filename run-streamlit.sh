#!/usr/bin/env bash
# Neon Vault - Streamlit Launcher Script

echo "🔓 Neon Vault - Escape Room"
echo "================================"

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "Creating .env from template..."
    
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✓ Created .env file"
        echo "⚠️  Please edit .env and add your GOOGLE_API_KEY"
        exit 1
    else
        echo "❌ .env.example not found!"
        exit 1
    fi
fi

# Check for GOOGLE_API_KEY
if ! grep -q "GOOGLE_API_KEY" .env; then
    echo "❌ GOOGLE_API_KEY not found in .env file!"
    exit 1
fi

# Install dependencies if needed
if ! python -c "import streamlit" 2>/dev/null; then
    echo "📦 Installing dependencies..."
    pip install -r requirements.txt
fi

# Launch Streamlit
echo "🚀 Launching Streamlit app..."
echo "📍 Open http://localhost:8501 in your browser"
echo ""

streamlit run streamlit_app.py
