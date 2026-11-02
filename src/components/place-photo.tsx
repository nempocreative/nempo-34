import { useEffect, useState } from "react";
import { Coffee, UtensilsCrossed } from "lucide-react";

type PlacePhotoProps = {
  src?: string | null;
  alt: string;
  kind: "cafe" | "culinary";
  className?: string;
  imageClassName?: string;
};

export function PlacePhoto({
  src,
  alt,
  kind,
  className = "",
  imageClassName = "",
}: PlacePhotoProps) {
  const [failed, setFailed] = useState(!src);

  useEffect(() => {
    setFailed(!src);
  }, [src]);

  const FallbackIcon = kind === "cafe" ? Coffee : UtensilsCrossed;
  const hasPositionClass = /\b(absolute|relative|fixed|sticky)\b/.test(className);

  return (
    <div className={`${hasPositionClass ? "" : "relative"} overflow-hidden ${className}`}>
      {failed ? (
        <div
          role="img"
          aria-label={`${alt}: foto belum tersedia`}
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background:
              "linear-gradient(180deg, #faf3e9 0%, #eee2d4 44%, #c4b8ad 73%, #56545a 100%)",
          }}
        >
          <FallbackIcon
            className="h-8 w-8"
            strokeWidth={1.5}
            aria-hidden="true"
            style={{
              color: "rgba(94, 64, 45, 0.44)",
              filter: "drop-shadow(0 1px 1px rgba(255,255,255,0.3))",
            }}
          />
        </div>
      ) : (
        <img
          src={src ?? undefined}
          alt={alt}
          onError={() => setFailed(true)}
          className={`block h-full w-full object-cover ${imageClassName}`}
        />
      )}
    </div>
  );
}
