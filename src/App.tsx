import { useState } from "react";
import { Background } from "./components/layout/Background";
import { Header } from "./components/layout/Header";
import { ChatPanel } from "./components/chat/ChatPanel";
import { WelcomeHero } from "./components/chat/WelcomeHero";
import { Sidebar } from "./components/sidebar/Sidebar";
import { useGameState } from "./hooks/useGameState";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    game,
    messages,
    input,
    setInput,
    isAiTyping,
    isSending,
    startGame,
    useHint,
    sendMessage,
    resetGame,
  } = useGameState();

  const handleStartGame = () => {
    startGame();
    setSidebarOpen(false);
  };

  return (
    <div className="relative flex min-h-dvh flex-col">
      <Background />
      <Header
        isPlaying={game.isPlaying}
        onStartGame={handleStartGame}
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
        sidebarOpen={sidebarOpen}
      />

      <div className="mx-auto flex w-full max-w-7xl flex-1 gap-0 lg:gap-4 lg:p-4">
        <Sidebar
          game={game}
          onStartGame={handleStartGame}
          onUseHint={useHint}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex min-h-0 flex-1 flex-col p-4 lg:p-0">
          {!game.isPlaying && messages.length <= 1 && (
            <WelcomeHero onStartGame={handleStartGame} />
          )}

          <div
            className={[
              "flex min-h-0 flex-1 flex-col",
              game.isPlaying || messages.length > 1 ? "h-[calc(100dvh-5rem)] lg:h-[calc(100dvh-6rem)]" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <ChatPanel
              messages={messages}
              input={input}
              onInputChange={setInput}
              onSend={sendMessage}
              isPlaying={game.isPlaying}
              isAiTyping={isAiTyping}
              isSending={isSending}
              gameWon={game.status === "won"}
              onPlayAgain={resetGame}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
