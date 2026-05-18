#!/usr/bin/env python3
"""
Streamlit Setup Verification Script
Checks that all dependencies and configuration are correct.
"""

import os
import sys
from pathlib import Path

def print_status(message: str, status: bool):
    """Print a status message with emoji."""
    emoji = "✅" if status else "❌"
    print(f"{emoji} {message}")
    return status

def check_dependencies():
    """Check if all required Python packages are installed."""
    print("\n📦 Checking Python Dependencies...")
    
    packages = {
        'streamlit': 'Streamlit framework',
        'google.generativeai': 'Google Generative AI',
        'python-dotenv': 'Environment variable loader',
    }
    
    all_ok = True
    for package, description in packages.items():
        try:
            __import__(package.split('.')[0])
            print_status(f"{description} ({package})", True)
        except ImportError:
            print_status(f"{description} ({package})", False)
            all_ok = False
    
    return all_ok

def check_environment():
    """Check if .env file exists and has required variables."""
    print("\n🔐 Checking Environment Configuration...")
    
    env_file = Path('.env')
    if not env_file.exists():
        print_status(".env file exists", False)
        print("   💡 Tip: Copy .env.example to .env and add your GOOGLE_API_KEY")
        return False
    
    print_status(".env file exists", True)
    
    # Check if API key is set
    from dotenv import load_dotenv
    load_dotenv()
    
    api_key = os.getenv('GOOGLE_API_KEY')
    if api_key and api_key != 'your_api_key_here':
        print_status("GOOGLE_API_KEY is configured", True)
        return True
    else:
        print_status("GOOGLE_API_KEY is configured", False)
        print("   💡 Tip: Add your API key from https://ai.google.dev/")
        return False

def check_files():
    """Check if required files exist."""
    print("\n📄 Checking Required Files...")
    
    files = {
        'streamlit_app.py': 'Main Streamlit application',
        'requirements.txt': 'Python dependencies',
        '.streamlit/config.toml': 'Streamlit configuration',
    }
    
    all_ok = True
    for filepath, description in files.items():
        exists = Path(filepath).exists()
        print_status(f"{description} ({filepath})", exists)
        all_ok = all_ok and exists
    
    return all_ok

def check_streamlit():
    """Test Streamlit installation."""
    print("\n🎮 Checking Streamlit...")
    
    try:
        import streamlit as st
        version = st.__version__
        print_status(f"Streamlit is installed (v{version})", True)
        return True
    except Exception as e:
        print_status(f"Streamlit check failed: {e}", False)
        return False

def check_gemini_api():
    """Test Google Generative AI."""
    print("\n🤖 Checking Google Generative AI...")
    
    try:
        import google.generativeai as genai
        print_status("Google Generative AI module loads", True)
        
        # Check if API key works
        api_key = os.getenv('GOOGLE_API_KEY')
        if api_key and api_key != 'your_api_key_here':
            try:
                genai.configure(api_key=api_key)
                # Try to list available models (lightweight test)
                models = genai.list_models()
                has_gemini = any('gemini' in model.name.lower() for model in models)
                print_status("Google API key is valid", has_gemini)
                return has_gemini
            except Exception as e:
                print_status(f"Google API connection: {str(e)}", False)
                return False
        else:
            print_status("Google API key not configured", False)
            return False
    except Exception as e:
        print_status(f"Google Generative AI check failed: {e}", False)
        return False

def main():
    """Run all checks."""
    print("\n" + "="*60)
    print("🔓 NEON VAULT - STREAMLIT SETUP VERIFICATION")
    print("="*60)
    
    checks = [
        ("Dependencies", check_dependencies()),
        ("Files", check_files()),
        ("Environment", check_environment()),
        ("Streamlit", check_streamlit()),
        ("Gemini API", check_gemini_api()),
    ]
    
    print("\n" + "="*60)
    print("📊 VERIFICATION SUMMARY")
    print("="*60)
    
    all_passed = True
    for name, result in checks:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {name}")
        all_passed = all_passed and result
    
    print("="*60)
    
    if all_passed:
        print("\n✅ All checks passed! You can run the app with:")
        print("   streamlit run streamlit_app.py")
        return 0
    else:
        print("\n❌ Some checks failed. Please fix the issues above.")
        print("\nQuick fixes:")
        print("1. Install dependencies: pip install -r requirements.txt")
        print("2. Create .env file: cp .env.example .env")
        print("3. Add API key to .env: https://ai.google.dev/")
        return 1

if __name__ == '__main__':
    sys.exit(main())
