interface FormattedTextProps {
  content: string;
}

export function FormattedText({ content }: FormattedTextProps) {
  return (
    <>
      {content.split("**").map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-white">
            {part}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}
