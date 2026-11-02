import { useMemo, useRef, useState } from "react";
import { Crown, Eye, Brush, Palette, Heart, Check } from "lucide-react";
import { Link } from "@/lib/wouter";
import {
  weddingDecor,
  weddingKebaya,
  weddingGowns,
  weddingOutfits,
  weddingMakeup,
  weddingMoodConsultUrl,
  weddingTones,
  type ToneKey,
  type WeddingOption,
  type WeddingOutfit,
  type WeddingTone,
} from "@/data/wedding-concepts";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const makeupIcons = {
  barbie: Crown,
  bold: Eye,
  natural: Brush,
  "soft-glam": Palette,
  korean: Heart,
};

function Swatch({ tone, size = "sm" }: { tone: WeddingTone; size?: "sm" | "md" }) {
  return (
    <span className="flex items-center gap-1" aria-hidden="true">
      {tone.hexes.map((hex) => (
        <span
          key={hex}
          className={cn(
            "rounded-full border border-foreground/10",
            size === "sm" ? "h-3 w-3" : "h-4 w-4",
          )}
          style={{ backgroundColor: hex }}
        />
      ))}
    </span>
  );
}

function OptionChip({
  option,
  tone,
  active,
  onSelect,
}: {
  option: WeddingOption;
  tone: ToneKey;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <Button
      variant="ghost"
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={cn(
        "h-auto min-h-0 w-full items-center gap-2 whitespace-normal rounded-lg border px-2.5 py-2 text-left text-[11px] font-semibold leading-tight transition-colors sm:h-8 sm:min-h-8 sm:w-auto sm:shrink-0 sm:gap-1.5 sm:whitespace-nowrap sm:rounded-md sm:px-2.5 sm:py-1 sm:text-xs",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background/70 text-foreground/80 hover:border-primary/50 hover:text-primary",
      )}
    >
      <img
        src={option.images[tone]}
        alt=""
        loading="lazy"
        className="size-8 shrink-0 rounded-md object-cover sm:size-4 sm:rounded-full"
      />
      <span className="min-w-0 flex-1">{option.name}</span>
      <Check
        className={cn(
          "size-4 shrink-0 transition-opacity sm:hidden",
          active ? "opacity-100" : "opacity-0",
        )}
      />
    </Button>
  );
}

function ComboCard({
  tone,
  decor,
  kebaya,
  active,
  onSelect,
}: {
  tone: WeddingTone;
  decor: WeddingOption;
  kebaya: WeddingOutfit;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <Button
      variant="ghost"
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={cn(
        "group h-auto min-h-0 items-stretch justify-start whitespace-normal p-0 flex flex-col overflow-hidden rounded-xl border bg-background/70 text-left transition-all duration-300",
        active
          ? "border-primary shadow-lg"
          : "border-border hover:border-primary/50 hover:-translate-y-0.5",
      )}
    >
      <span className="flex flex-col gap-px overflow-hidden bg-border/60">
        <img
          src={decor.images[tone.key]}
          alt={`Pelaminan ${decor.name} tone ${tone.name}`}
          loading="lazy"
          width={decor.width}
          height={decor.height}
          className="h-auto w-full"
        />
        <img
          src={kebaya.images[tone.key]}
          alt={`${kebaya.category === "gown" ? "Gaun" : "Kebaya"} ${kebaya.name} dan ${kebaya.groomName} pada manekin tanpa wajah, tone ${tone.name}`}
          loading="lazy"
          width={kebaya.width}
          height={kebaya.height}
          className="h-auto w-full"
        />
      </span>
      <span className="flex flex-1 flex-col gap-1 p-2 sm:p-3">
        <span className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "text-[11px] font-bold leading-tight sm:text-sm",
              active ? "text-primary" : "text-foreground",
            )}
          >
            {tone.name}
          </span>
          <Swatch tone={tone} />
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:text-[11px]">
          {decor.name} · {kebaya.name} + {kebaya.groomName}
        </span>
        <span className="mt-auto pt-2 text-[11px] font-bold text-primary">
          {active ? "Dipilih ✓" : "Pilih kombinasi ini"}
        </span>
      </span>
    </Button>
  );
}

export function WeddingConceptStudio() {
  const [tone, setTone] = useState<ToneKey>("sage");
  const [decorKey, setDecorKey] = useState(weddingDecor[0]?.key ?? "garden");
  const [kebayaKey, setKebayaKey] = useState(weddingKebaya[0]?.key ?? "ivory");
  const [makeupKey, setMakeupKey] = useState("natural");
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeTone = useMemo(() => weddingTones.find((t) => t.key === tone) ?? weddingTones[0], [tone]);
  const decor = useMemo(
    () => weddingDecor.find((d) => d.key === decorKey) ?? weddingDecor[0],
    [decorKey],
  );
  const kebaya = useMemo(
    () => weddingOutfits.find((k) => k.key === kebayaKey) ?? weddingKebaya[0],
    [kebayaKey],
  );
  const makeup = weddingMakeup.find((option) => option.key === makeupKey);

  const consultUrl = useMemo(() => activeTone && decor && kebaya ? weddingMoodConsultUrl({ tone: activeTone, decor, kebaya, makeup }) : "", [
    activeTone,
    decor,
    kebaya,
    makeup,
  ]);

  if (!activeTone || !decor || !kebaya) return null;

  function scrollIntoViewOnMobile() {
    if (window.matchMedia("(max-width: 640px)").matches) {
      scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  return (
    <section id="konsep" className="relative bg-background py-10 md:py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,var(--wed-pearl),transparent_42%),radial-gradient(circle_at_82%_78%,var(--wed-champagne),transparent_40%)]"
      />
      <div ref={scrollRef} className="relative mx-auto max-w-6xl px-4">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
            Studio Konsep
          </span>
          <h2 className="font-display text-xl leading-tight text-foreground sm:text-2xl">
            Bandingkan dulu, baru pilih
          </h2>
          <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground">
            Pelaminan · Kebaya & Gaun · Busana pria · Makeup
          </p>
        </div>

        <div className="mt-4 grid gap-3 sm:gap-2">
          <div className="grid min-w-0 gap-1.5 sm:grid-cols-[112px_minmax(0,1fr)] sm:items-center sm:gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground sm:text-xs sm:font-semibold sm:normal-case sm:tracking-normal">
              Pelaminan
            </span>
            <div className="grid min-w-0 grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-1.5">
            {weddingDecor.map((option) => (
              <OptionChip
                key={option.key}
                option={option}
                tone={tone}
                active={option.key === decor.key}
                onSelect={() => {
                  setDecorKey(option.key);
                  scrollIntoViewOnMobile();
                }}
              />
            ))}
            </div>
          </div>
          <div className="grid min-w-0 gap-1.5 sm:grid-cols-[112px_minmax(0,1fr)] sm:items-center sm:gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground sm:text-xs sm:font-semibold sm:normal-case sm:tracking-normal">
              Kebaya & Beskap
            </span>
            <div className="grid min-w-0 grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-1.5">
            {weddingKebaya.map((option) => (
              <OptionChip
                key={option.key}
                option={option}
                tone={tone}
                active={option.key === kebaya.key}
                onSelect={() => {
                  setKebayaKey(option.key);
                  scrollIntoViewOnMobile();
                }}
              />
            ))}
            </div>
          </div>
          <div className="grid min-w-0 gap-1.5 sm:grid-cols-[112px_minmax(0,1fr)] sm:items-center sm:gap-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground sm:text-xs sm:font-semibold sm:normal-case sm:tracking-normal">
              Khusus Gaun & Jas
            </span>
            <div className="grid min-w-0 grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:gap-1.5">
            {weddingGowns.map((option) => (
              <OptionChip
                key={option.key}
                option={option}
                tone={tone}
                active={option.key === kebaya.key}
                onSelect={() => {
                  setKebayaKey(option.key);
                  scrollIntoViewOnMobile();
                }}
              />
            ))}
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
          {weddingTones.map((option) => (
            <ComboCard
              key={option.key}
              tone={option}
              decor={decor}
              kebaya={kebaya}
              active={option.key === tone}
              onSelect={() => {
                setTone(option.key);
                scrollIntoViewOnMobile();
              }}
            />
          ))}
        </div>

        <div className="mt-8">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Makeup Pengantin</h3>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {weddingMakeup.map((option) => {
              const Icon = makeupIcons[option.key as keyof typeof makeupIcons] ?? Brush;
              const selected = makeupKey === option.key;
              return (
                <Button
                  key={option.key}
                  variant="ghost"
                  aria-pressed={selected}
                  onClick={() => setMakeupKey(option.key)}
                  className={cn("h-auto flex-col gap-0 items-stretch justify-start overflow-hidden whitespace-normal rounded-lg border p-0 text-left", selected ? "border-primary bg-primary/5" : "border-border bg-background/70")}
                >
                  <img src={option.image} alt={`Contoh makeup pengantin ${option.name}`} loading="lazy" width={800} height={1008} className="h-auto w-full" />
                  <span className="flex flex-1 flex-col gap-2 p-3">
                  <span className="flex items-center gap-2 text-primary"><Icon className="size-4" /><span className="text-sm font-bold">{option.name}</span>{selected ? <Check className="ml-auto size-4" /> : null}</span>
                  <span className="text-xs font-normal leading-relaxed text-muted-foreground">{option.note}</span>
                  </span>
                </Button>
              );
            })}
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">Foto ilustrasi inspirasi makeup, bukan dokumentasi hasil MUA.</p>
        </div>

        <div
          key={activeTone.key + "-" + decor.key + "-" + kebaya.key + "-" + makeupKey}
          className="wed-mood-enter mt-5 flex flex-col gap-3 rounded-xl border border-border bg-background/70 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex flex-wrap items-center gap-3">
            <Swatch tone={activeTone} size="md" />
            <span className="text-sm font-bold text-foreground">{activeTone.name}</span>
            <span className="text-xs text-muted-foreground">
              {decor.name} · {kebaya.name} + {kebaya.groomName} · Makeup {makeup?.name}
            </span>
          </div>
          <div className="shrink-0">
            <a
              href={consultUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md bg-primary px-4 py-2.5 text-center text-xs font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Konsultasikan pilihan ini
            </a>
          </div>
        </div>

        <p className="mt-3 text-[11px] text-muted-foreground">
          Foto adalah ilustrasi konsep; realisasi dekor, bunga, dan busana bisa disesuaikan budget
          dan venue. Detail:{" "}
          <Link href="/wedding-invitation" className="font-semibold text-primary underline-offset-4 hover:underline">
            undangan digital
          </Link>
        </p>
      </div>
    </section>
  );
}
