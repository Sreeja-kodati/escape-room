import { useEffect, useRef, useState } from "react";

interface UseTypewriterOptions {
  text: string;
  speed?: number;
  enabled?: boolean;
  onComplete?: () => void;
}

export function useTypewriter({
  text,
  speed = 18,
  enabled = true,
  onComplete,
}: UseTypewriterOptions) {
  const [displayed, setDisplayed] = useState(enabled ? "" : text);
  const [isComplete, setIsComplete] = useState(!enabled);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (!enabled) {
      setDisplayed(text);
      setIsComplete(true);
      return;
    }

    setDisplayed("");
    setIsComplete(false);
    let index = 0;

    const interval = setInterval(() => {
      index += 1;
      setDisplayed(text.slice(0, index));

      if (index >= text.length) {
        clearInterval(interval);
        setIsComplete(true);
        onCompleteRef.current?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, enabled]);

  return { displayed, isComplete };
}
