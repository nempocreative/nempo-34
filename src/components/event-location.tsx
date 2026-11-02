import { ArrowUpRight, MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EventLocation({ location, embedUrl, directionsUrl }: { location: string; embedUrl: string; directionsUrl: string }) {
  return <section className="event-location border-y border-border bg-card text-foreground py-5" aria-labelledby="event-location-title">
    <header className="px-4 sm:px-5 mb-4 flex items-start gap-3">
      <MapPin className="size-5 text-primary shrink-0 mt-0.5" />
      <div className="min-w-0"><h2 id="event-location-title" className="text-lg font-extrabold">Lokasi Acara</h2><p className="mt-1 text-sm text-muted-foreground leading-relaxed">{location}</p></div>
    </header>
    <div className="mx-4 sm:mx-5 overflow-hidden rounded-lg border border-border bg-muted">
      <iframe title={`Peta lokasi ${location}`} src={embedUrl} className="block w-full h-[280px] sm:h-[360px] border-0" allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
    </div>
    <div className="px-4 sm:px-5 mt-4 flex flex-wrap items-center justify-between gap-3">
      <span className="text-xs font-semibold text-muted-foreground">Google Maps</span>
      <Button asChild><a href={directionsUrl} target="_blank" rel="noopener noreferrer"><Navigation />Buka arah ke lokasi<ArrowUpRight /></a></Button>
    </div>
  </section>;
}