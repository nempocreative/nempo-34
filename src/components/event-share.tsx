import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function EventShare({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  async function share() {
    const link = window.location.href;
    setUrl(link);
    setCopied(false);
    setError("");
    if (navigator.share) {
      try {
        await navigator.share({ title, text: title, url: link });
        return;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
      }
    }
    setOpen(true);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setError("");
    } catch {
      setError("Belum bisa menyalin otomatis. Pilih dan salin tautan di bawah.");
    }
  }

  const encodedUrl = encodeURIComponent(url);
  const text = encodeURIComponent(`${title}\n${url}`);
  const destinations = [
    { label: "WhatsApp", href: `https://wa.me/?text=${text}` },
    { label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: "X", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodedUrl}` },
    { label: "Telegram", href: `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(title)}` },
    { label: "Email", href: `mailto:?subject=${encodeURIComponent(title)}&body=${text}` },
  ];

  return <>
    <Button variant="secondary" size="icon" onClick={share} aria-label="Bagikan acara" title="Bagikan acara" className="h-10 w-10 rounded-full"><Share2 /></Button>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-md">
        <DialogHeader><DialogTitle>Bagikan acara</DialogTitle><DialogDescription>{title}</DialogDescription></DialogHeader>
        <div className="grid grid-cols-2 gap-2">
          {destinations.map((d) => <Button key={d.label} variant="outline" asChild><a href={d.href} target="_blank" rel="noopener noreferrer">{d.label}</a></Button>)}
          <Button variant="outline" onClick={copy}>{copied ? <Check /> : <Copy />}{copied ? "Tautan disalin" : "Salin tautan"}</Button>
        </div>
        <input aria-label="Tautan acara" readOnly value={url} onFocus={(e) => e.currentTarget.select()} className="w-full min-w-0 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground" />
        {error && <p role="alert" className="text-sm text-muted-foreground">{error}</p>}
      </DialogContent>
    </Dialog>
  </>;
}