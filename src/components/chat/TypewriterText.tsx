import { useTypewriter } from "../../hooks/useTypewriter";
import { FormattedText } from "./FormattedText";

interface TypewriterTextProps {
  text: string;
  enabled?: boolean;
  onComplete?: () => void;
}

export function TypewriterText({
  text,
  enabled = true,
  onComplete,
}: TypewriterTextProps) {
  const { displayed } = useTypewriter({
    text,
    speed: 16,
    enabled,
    onComplete,
  });

  return <FormattedText content={enabled ? displayed : text} />;
}
