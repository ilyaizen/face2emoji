import Image from "next/image";

interface EmojiResultProps {
  url: string;
}

export function EmojiResult({ url }: EmojiResultProps) {
  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-2">Your Emoji Result:</h2>
      <Image
        src={url}
        alt="Emoji Result"
        width={400}
        height={400}
        objectFit="contain"
        className="rounded-md"
      />
    </div>
  );
}
