import Image from "next/image";

interface EmojiResultProps {
  url: string;
}

export function EmojiResult({ url }: EmojiResultProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-32 h-32">
        <Image
          src={url}
          alt="Emoji Result"
          fill
          style={{ objectFit: "contain" }}
          className="rounded-md"
        />
      </div>
    </div>
  );
}
