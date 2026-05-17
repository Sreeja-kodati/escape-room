import { useState } from "react";
import { Confetti } from "./components/effects/Confetti";
import { DangerFlash } from "./components/effects/DangerFlash";
import { WinOverlay } from "./components/effects/WinOverlay";
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
    isLoading,
    feedback,
    showConfetti,
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
      <DangerFlash active={feedback === "wrong"} />
      <Confetti active={showConfetti} />
      {game.status === "won" && (
        <WinOverlay
          score={game.score}
          elapsedSeconds={game.elapsedSeconds}
          onPlayAgain={resetGame}
        />
      )}
      <Header
        isPlaying={game.isPlaying}
        isLoading={isLoading}
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
          isLoading={isLoading}
        />

        <main className="flex min-h-0 flex-1 flex-col p-3 sm:p-4 lg:p-0">
          {!game.isPlaying && messages.length <= 1 && (
            <WelcomeHero onStartGame={handleStartGame} isLoading={isLoading} />
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
              isLoading={isLoading}
              gameWon={game.status === "won"}
              onPlayAgain={resetGame}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
