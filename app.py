"""
Entry point for the Neon Vault Escape Room Streamlit application.

This file serves as the main entry point for running the application.
It can be run directly with:
    - streamlit run app.py
    - python -m streamlit run app.py

Or deployed to Streamlit Cloud by pointing to this repository.
"""

import subprocess
import sys


def main():
    """Launch the Streamlit app."""
    # Run the main Streamlit application
    subprocess.run(
        [sys.executable, "-m", "streamlit", "run", "streamlit_app.py"],
        check=True,
    )


if __name__ == "__main__":
    main()