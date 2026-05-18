"""
Streamlit Escape Room - Neon Vault
A cyberpunk escape room experience powered by Google Gemini AI.

This is a Streamlit-native implementation of the escape room game.
Run with: streamlit run streamlit_app.py
"""

import os
import json
import time
from datetime import datetime
from dotenv import load_dotenv

import streamlit as st
import google.generativeai as genai

# Load environment variables
load_dotenv()

# ============================================================================
# Game Configuration & Level Definitions
# ============================================================================

MAX_LEVEL = 3

LEVELS = [
    {
        "id": 1,
        "name": "The Neon Vault",
        "scenario": (
            "The room hums with electric blue light. A locked terminal glows on the far wall, "
            "and three symbols are etched into the floor: **△ ○ ✕**. The terminal awaits input. "
            "What do you do?"
        ),
        "hints": [
            "Look at the floor symbols — the terminal wants them **in order**, from left to right.",
            "Try typing the symbol names: **triangle**, then **circle**, then **x**.",
            "Enter exactly: **triangle circle x** (or use the symbols △ ○ ✕).",
        ],
        "levelCompleteBonus": 150,
    },
    {
        "id": 2,
        "name": "The Signal Room",
        "scenario": (
            "Static fills the air. A radio transmitter blinks beside a frequency dial locked at "
            "**????**. A note reads: *'The code is spoken in the static: seven, three, five, one.'* "
            "What do you do?"
        ),
        "hints": [
            "Read the note carefully — it spells out digits verbally.",
            "The frequency code is four numbers spoken aloud in the note.",
            "Enter the code **7351** into the transmitter or say it in chat.",
        ],
        "levelCompleteBonus": 200,
    },
    {
        "id": 3,
        "name": "The Final Lock",
        "scenario": (
            "The elevator opens to a bare chamber. One door, no handle — only a voice panel. "
            "A calm synthetic voice says: *'Authorization required. State your intention to leave.'* "
            "What do you do?"
        ),
        "hints": [
            "The voice panel wants to know you intend to **leave**.",
            "Try words like **escape**, **exit**, or **open the door**.",
            "Say clearly that you want to **escape** the facility.",
        ],
        "levelCompleteBonus": 300,
    },
]


def get_level(level_id: int) -> dict:
    """Get level definition by ID."""
    for level in LEVELS:
        if level["id"] == level_id:
            return level
    return LEVELS[-1]


# ============================================================================
# Initial Game State
# ============================================================================

def get_initial_game_state() -> dict:
    """Return the initial game state."""
    return {
        "is_playing": False,
        "status": "idle",  # idle, playing, won
        "score": 100,
        "level": 1,
        "level_name": "The Neon Vault",
        "hints_used": 0,
        "hints_remaining": 3,
        "level_hint_index": 0,
        "elapsed_seconds": 0,
        "start_time": None,
    }


# ============================================================================
# Gemini AI Integration
# ============================================================================

@st.cache_resource
def get_gemini_client():
    """Initialize and configure the Gemini API (cached)."""
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        st.error("❌ GOOGLE_API_KEY is not set. Please add it to your .env file.")
        st.stop()
    genai.configure(api_key=api_key)
    return genai


def build_narrator_system_prompt(game: dict) -> str:
    """Build the system prompt for the AI narrator."""
    level = get_level(game["level"])
    level_context = (
        f'Level {game["level"]}/{MAX_LEVEL}: "{level["name"]}" — '
        f"Theme: cyberpunk neon escape room. Bonus on solve: {level['levelCompleteBonus']} pts."
    )

    return f"""You are the AI Narrator of "Neon Vault", a cinematic cyberpunk escape room experience.

ROLE:
- Speak in second person ("you see...", "the terminal hums...")
- Be atmospheric, tense, and concise (2-5 sentences unless the moment demands more)
- Invent vivid sensory details: neon light, static, holograms, locked doors, hidden codes
- Create ONE clear solvable puzzle per level that players can crack via chat (codes, symbols, riddles, items)
- Track story continuity — reference what the player already did and discovered
- Never break character. Never mention being an AI model or JSON
- Use **bold** sparingly for important objects/clues

GAME RULES YOU MUST ENFORCE:
- Current level: {game["level"]} of {MAX_LEVEL}
- {level_context}
- When the player genuinely solves the current level puzzle, set puzzleSolved: true
- Only set gameWon: true when level is {MAX_LEVEL} AND they complete the final escape
- If the attempt is wrong or unclear, puzzleSolved: false and react in-character
- Hints must NOT give the full answer — escalate subtlety based on hintTier (0=vague, 1=clearer, 2=strong nudge)

RESPONSE FORMAT — return ONLY valid JSON, no markdown fences:
{{
  "narrative": "your in-character narrator response",
  "puzzleSolved": boolean,
  "gameWon": boolean,
  "nextLevelIntro": "only when puzzleSolved true AND gameWon false — describe the NEW room they enter for the next level"
}}"""


def format_history(messages: list) -> str:
    """Format chat history for the prompt."""
    if not messages:
        return "(No prior messages)"
    return "\n".join(
        f"[{m['role'].upper()}]: {m['content']}" for m in messages[-16:]
    )


def build_chat_user_prompt(game: dict, user_message: str, history: list) -> str:
    """Build the user prompt for chat."""
    return f"""GAME STATE:
- Level: {game["level"]} ({game["level_name"]})
- Score: {game["score"]}
- Hints used: {game["hints_used"]}, remaining: {game["hints_remaining"]}
- Elapsed: {game["elapsed_seconds"]}s

CONVERSATION HISTORY:
{format_history(history)}

PLAYER ACTION:
{user_message}

Respond as the narrator. Decide if they solved the level puzzle."""


def build_hint_user_prompt(game: dict, history: list, hint_tier: int) -> str:
    """Build the user prompt for hints."""
    return f"""GAME STATE:
- Level: {game["level"]} ({game["level_name"]})
- Hint tier: {hint_tier} (0=subtle, 1=medium, 2=strong but not full solution)

CONVERSATION HISTORY:
{format_history(history)}

Generate a hint for the player's CURRENT unsolved puzzle. Return JSON:
{{
  "narrative": "the hint text prefixed with a clue emoji is fine",
  "puzzleSolved": false,
  "gameWon": false,
  "nextLevelIntro": ""
}}"""


def build_level_intro_prompt(game: dict) -> str:
    """Build the prompt for level introduction."""
    level = get_level(game["level"])
    level_context = (
        f'Level {game["level"]}/{MAX_LEVEL}: "{level["name"]}" — '
        f"Theme: cyberpunk neon escape room. Bonus on solve: {level['levelCompleteBonus']} pts."
    )
    return f"""GAME STATE:
- Starting level: {game["level"]}
- {level_context}

Generate the OPENING scene for this level — describe the room, the main puzzle, and end with an inviting question.
Return JSON:
{{
  "narrative": "opening scene text",
  "puzzleSolved": false,
  "gameWon": false,
  "nextLevelIntro": ""
}}"""


def build_start_game_prompt() -> str:
    """Build the prompt for starting the game."""
    level = get_level(1)
    return f"""The player just hit START. Generate level 1 opening for "{level['name']}".
Introduce the Neon Vault cyberpunk escape room, describe the first chamber and puzzle, end with a question.
Return JSON with narrative only (puzzleSolved and gameWon false, nextLevelIntro empty)."""


def parse_gemini_response(text: str) -> dict:
    """Parse and validate the Gemini JSON response."""
    # Clean up markdown code blocks if present
    cleaned = text.replace("```json\n", "").replace("```", "").strip()
    parsed = json.loads(cleaned)

    if "narrative" not in parsed or not isinstance(parsed["narrative"], str):
        raise ValueError("Invalid Gemini response: missing narrative")

    return {
        "narrative": parsed["narrative"].strip(),
        "puzzle_solved": bool(parsed.get("puzzleSolved", False)),
        "game_won": bool(parsed.get("gameWon", False)),
        "next_level_intro": parsed.get("nextLevelIntro", "").strip(),
    }


def gemini_generate(system_prompt: str, user_prompt: str) -> dict:
    try:
        genai_client = get_gemini_client()
        
        # Use the generative model with system instruction
        model = genai_client.GenerativeModel(
            model_name="gemini-2.0-flash",
            system_instruction=system_prompt,
            generation_config={
                "temperature": 0.85,
                "max_output_tokens": 1024,
                "response_mime_type": "application/json",
            },
        )
        
        response = model.generate_content(user_prompt)
        
        if not response.text:
            raise ValueError("Empty response from Gemini")
        
        return parse_gemini_response(response.text)
    
    except Exception as e:
        st.error(f"❌ Gemini API Error: {str(e)}")
        raise


# ============================================================================
# Game Logic
# ============================================================================

def apply_gemini_response(gemini_response: dict, game: dict) -> dict:
    """Apply the Gemini response to the game state and return results."""
    level = get_level(game["level"])
    result = {
        "assistant_content": gemini_response["narrative"],
        "system_content": "",
        "game_updates": {},
        "level_advanced": False,
        "game_won": False,
        "next_level_intro": "",
    }

    # Check for game win
    if gemini_response["game_won"] and game["level"] >= MAX_LEVEL and gemini_response["puzzle_solved"]:
        result["system_content"] = (
            "🎉 **MISSION COMPLETE** — You escaped the Neon Vault! Final score locked."
        )
        result["game_updates"] = {
            "score": game["score"] + level["levelCompleteBonus"],
            "status": "won",
            "is_playing": False,
        }
        result["game_won"] = True
        return result

    # Check for level advancement
    if gemini_response["puzzle_solved"] and game["level"] < MAX_LEVEL:
        next_level_id = game["level"] + 1
        next_level = get_level(next_level_id)

        result["system_content"] = (
            f"— Level {game['level']} cleared! Advancing to Level {next_level_id}: {next_level['name']} —"
        )
        result["game_updates"] = {
            "score": game["score"] + level["levelCompleteBonus"] + 25,
            "level": next_level_id,
            "level_name": next_level["name"],
            "level_hint_index": 0,
        }
        result["level_advanced"] = True
        result["next_level_intro"] = gemini_response["next_level_intro"]
        return result

    # Check for final level completion
    if gemini_response["puzzle_solved"] and game["level"] >= MAX_LEVEL:
        result["system_content"] = (
            "🎉 **MISSION COMPLETE** — You escaped the Neon Vault! Final score locked."
        )
        result["game_updates"] = {
            "score": game["score"] + level["levelCompleteBonus"],
            "status": "won",
            "is_playing": False,
        }
        result["game_won"] = True
        return result

    # Default: incorrect attempt
    result["game_updates"] = {
        "score": max(0, game["score"] - 5),
    }
    return result


# ============================================================================
# Session State Management
# ============================================================================

def init_session_state():
    """Initialize Streamlit session state for the game."""
    if "game_state" not in st.session_state:
        st.session_state.game_state = get_initial_game_state()
    if "chat_messages" not in st.session_state:
        st.session_state.chat_messages = []
    if "game_started" not in st.session_state:
        st.session_state.game_started = False
    if "start_time" not in st.session_state:
        st.session_state.start_time = None
    if "timer_placeholder" not in st.session_state:
        st.session_state.timer_placeholder = None


def update_game_state(updates: dict):
    """Update the game state with new values."""
    for key, value in updates.items():
        st.session_state.game_state[key] = value


def add_chat_message(role: str, content: str, animate: bool = False):
    """Add a message to the chat history."""
    st.session_state.chat_messages.append({
        "role": role,
        "content": content,
        "timestamp": datetime.now(),
        "animate": animate,
    })


# ============================================================================
# UI Components
# ============================================================================

def render_sidebar():
    """Render the sidebar with game stats and controls."""
    with st.sidebar:
        st.title("🎮 Neon Vault")
        st.subheader("Escape Room")

        game = st.session_state.game_state

        # Game Stats
        col1, col2 = st.columns(2)
        with col1:
            st.metric("Level", f"{game['level']}/{MAX_LEVEL}")
            st.metric("Score", game["score"])
        with col2:
            st.metric("Hints Left", game["hints_remaining"])
            if st.session_state.game_started and st.session_state.start_time:
                elapsed = int(time.time() - st.session_state.start_time)
                st.metric("Elapsed", f"{elapsed}s")

        st.divider()

        # Current Level Info
        level_data = get_level(game["level"])
        st.markdown(f"**📍 {level_data['name']}**")

        # Game Status
        if game["status"] == "won":
            st.success("🎉 You escaped! Great job!")
        elif game["is_playing"]:
            st.info("🎮 Game in progress")
        else:
            st.warning("Press START in the main area to begin")

        st.divider()

        # Hint button
        if (st.session_state.game_started and 
            game["is_playing"] and 
            game["status"] != "won" and
            game["hints_remaining"] > 0):
            
            if st.button("💡 Get Hint", use_container_width=True):
                with st.spinner("Analyzing the puzzle..."):
                    try:
                        history = [
                            {"role": m["role"], "content": m["content"]}
                            for m in st.session_state.chat_messages
                        ]
                        
                        hint_tier = game["hints_used"]  # 0, 1, or 2
                        system_prompt = build_narrator_system_prompt(game)
                        user_prompt = build_hint_user_prompt(game, history, hint_tier)
                        
                        gemini_response = gemini_generate(system_prompt, user_prompt)
                        
                        # Update game state
                        game["hints_used"] += 1
                        game["hints_remaining"] -= 1
                        game["score"] = max(0, game["score"] - 10)  # Hint penalty
                        
                        # Add hint to chat
                        add_chat_message("assistant", f"💡 **Hint:** {gemini_response['narrative']}")
                        
                    except Exception as e:
                        st.error(f"Error getting hint: {str(e)}")
                
                st.rerun()

        elif game["hints_remaining"] <= 0 and game["is_playing"]:
            st.warning("No hints remaining!")

        st.divider()

        # Reset button
        if st.button("🔄 New Game", use_container_width=True):
            st.session_state.game_state = get_initial_game_state()
            st.session_state.chat_messages = []
            st.session_state.game_started = False
            st.session_state.start_time = None
            st.rerun()


def render_chat():
    """Render the chat interface."""
    st.title("🔓 NEON VAULT")
    st.subheader("A Cyberpunk Escape Room Experience")

    # Display chat messages in a scrollable container
    chat_container = st.container()
    with chat_container:
        for msg in st.session_state.chat_messages:
            if msg["role"] == "user":
                with st.chat_message("user"):
                    st.write(msg["content"])
            elif msg["role"] == "assistant":
                with st.chat_message("assistant"):
                    st.markdown(msg["content"])
            elif msg["role"] == "system":
                with st.chat_message("system"):
                    st.info(msg["content"])

    st.divider()

    # Chat input
    game = st.session_state.game_state
    if game["is_playing"] and game["status"] != "won":
        if prompt := st.chat_input("What do you do?", key="chat_input"):
            # Add user message immediately
            add_chat_message("user", prompt)
            
            # Show spinner while processing
            with st.spinner("🔄 The room responds..."):
                try:
                    history = [
                        {"role": m["role"], "content": m["content"]}
                        for m in st.session_state.chat_messages[:-1]  # Exclude the message we just added
                    ]

                    system_prompt = build_narrator_system_prompt(game)
                    user_prompt = build_chat_user_prompt(game, prompt, history)

                    gemini_response = gemini_generate(system_prompt, user_prompt)
                    result = apply_gemini_response(gemini_response, game)

                    # Update game state
                    update_game_state(result["game_updates"])

                    # Add assistant response
                    add_chat_message("assistant", result["assistant_content"])

                    # Add system message if any
                    if result["system_content"]:
                        add_chat_message("system", result["system_content"])

                    # Handle level advancement
                    if result["level_advanced"] and result["next_level_intro"]:
                        time.sleep(0.5)
                        add_chat_message("assistant", f"\n\n{result['next_level_intro']}")

                    # Check for game win
                    if result["game_won"]:
                        time.sleep(0.5)
                        st.balloons()

                except Exception as e:
                    add_chat_message("system", f"❌ Error: {str(e)}")

            st.rerun()
    
    elif game["status"] == "won":
        st.chat_input("Congratulations! Start a new game to play again.", disabled=True)
        st.success("🎉 Game Complete! Final Score: " + str(game["score"]))
    
    else:
        st.chat_input("Press START to begin your escape...", disabled=True)


def render_start_screen():
    """Render the game start screen."""
    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        st.markdown("""
        <div style="text-align: center; padding: 2rem;">
            <h1 style="font-size: 3rem; color: #00f0ff; text-shadow: 0 0 20px #00f0ff;">
                🔓 NEON VAULT
            </h1>
            <h2 style="color: #ff00ff; text-shadow: 0 0 10px #ff00ff;">
                A Cyberpunk Escape Room
            </h2>
            <p style="font-size: 1.2rem; color: #cccccc; margin: 2rem 0;">
                You wake up in a dimly lit chamber. Neon lights flicker across metallic walls.
                The air hums with electricity. Somewhere, a terminal beeps rhythmically.
                <br><br>
                <strong>You need to escape.</strong>
            </p>
            <p style="color: #888;">
                🧩 Solve puzzles • 💡 Use hints wisely • ⏱️ Beat the clock
            </p>
        </div>
        """, unsafe_allow_html=True)

        if st.button("▶️ START GAME", type="primary", use_container_width=True, key="start_btn"):
            st.session_state.game_started = True
            st.session_state.start_time = time.time()
            st.session_state.game_state["is_playing"] = True
            st.session_state.game_state["status"] = "playing"

            # Generate opening narrative
            with st.spinner("Entering the Neon Vault..."):
                try:
                    system_prompt = build_narrator_system_prompt(st.session_state.game_state)
                    user_prompt = build_start_game_prompt()

                    gemini_response = gemini_generate(system_prompt, user_prompt)

                    # Add opening narrative
                    add_chat_message("assistant", gemini_response["narrative"], animate=True)

                except Exception as e:
                    st.error(f"Failed to start game: {str(e)}")

            st.rerun()


# ============================================================================
# Main App
# ============================================================================

def main():
    """Main Streamlit app entry point."""
    # Page configuration
    st.set_page_config(
        page_title="Neon Vault - Escape Room",
        page_icon="🔓",
        layout="centered",
        initial_sidebar_state="expanded",
    )

    # Custom CSS for cyberpunk theme
    st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Rajdhani:wght@300;500;700&display=swap');

    /* Global styles */
    .stApp {
        background: linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%);
        font-family: 'Rajdhani', sans-serif;
    }

    /* Title styling */
    h1, h2, h3 {
        font-family: 'Orbitron', sans-serif;
        color: #00f0ff;
    }

    /* Sidebar */
    [data-testid="stSidebar"] {
        background: linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 100%);
        border-right: 1px solid #00f0ff33;
    }

    /* Chat messages */
    [data-testid="stChatMessage"] {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 10px;
        border: 1px solid rgba(0, 240, 255, 0.2);
    }

    /* Buttons */
    .stButton > button {
        background: linear-gradient(135deg, #00f0ff 0%, #ff00ff 100%);
        color: #000;
        font-weight: bold;
        font-family: 'Orbitron', sans-serif;
        border: none;
        transition: all 0.3s ease;
    }

    .stButton > button:hover {
        transform: scale(1.05);
        box-shadow: 0 0 20px rgba(0, 240, 255, 0.5);
    }

    /* Metrics */
    [data-testid="stMetric"] {
        color: #00f0ff;
    }

    /* Input */
    .stChatInput > div {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid #00f0ff44;
    }

    /* Hide Streamlit branding */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    </style>
    """, unsafe_allow_html=True)

    # Initialize session state
    init_session_state()

    # Render sidebar
    render_sidebar()

    # Render main content
    if not st.session_state.game_started:
        render_start_screen()
    else:
        render_chat()


if __name__ == "__main__":
    main()