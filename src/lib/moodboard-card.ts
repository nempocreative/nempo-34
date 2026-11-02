// Renders the chosen wedding concept as a shareable PNG card drawn on canvas.
import { NEMPO_INSTAGRAM_HANDLE, NEMPO_WA_NUMBER } from "@/lib/contact";

export type MoodboardCardData = {
  toneName: string;
  toneHexes: string[];
  toneNote: string;
  decorName: string;
  decorImage: string;
  kebayaName: string;
  kebayaImage: string;
  makeupName?: string;
};

const W = 1080;
const H = 1350;
const SERIF = '"Playfair Display", Georgia, serif';
const HAND = '"Caveat", "Segoe Script", cursive';
const SANS = '"Plus Jakarta Sans", "DM Sans", system-ui, sans-serif';

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Gagal memuat gambar moodboard"));
    img.src = src;
  });
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.lineTo(x + w - rad, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rad);
  ctx.lineTo(x + w, y + h - rad);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rad, y + h);
  ctx.lineTo(x + rad, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rad);
  ctx.lineTo(x, y + rad);
  ctx.quadraticCurveTo(x, y, x + rad, y);
  ctx.closePath();
}

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const scale = Math.min(w / img.width, h / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

function wrap(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  lines.forEach((l, i) => ctx.fillText(l, x, y + i * lineHeight));
  return lines.length;
}

async function ensureFonts() {
  if (!("fonts" in document)) return;
  try {
    await Promise.all([
      document.fonts.load(`700 64px ${SERIF}`),
      document.fonts.load(`400 40px ${HAND}`),
      document.fonts.load(`600 28px ${SANS}`),
    ]);
    await document.fonts.ready;
  } catch {
    /* fall back to system fonts */
  }
}

export async function renderMoodboardCard(data: MoodboardCardData): Promise<Blob> {
  await ensureFonts();
  const deep = data.toneHexes[0] ?? "#4f6a4a";
  const light = data.toneHexes[1] ?? "#f7f2e7";
  const [decor, kebaya] = await Promise.all([loadImage(data.decorImage), loadImage(data.kebayaImage)]);
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas tidak tersedia");

  ctx.fillStyle = light;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = deep;
  ctx.fillRect(0, 0, W, 12);

  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = deep;
  ctx.font = `600 26px ${SANS}`;
  ctx.letterSpacing = "6px";
  ctx.fillText("NEMPO GARUT ORGANIZER", 64, 100);
  ctx.letterSpacing = "0px";

  ctx.font = `700 68px ${SERIF}`;
  ctx.fillStyle = "#2b2118";
  ctx.fillText("Moodboard Pernikahan", 64, 172);
  ctx.font = `400 40px ${HAND}`;
  ctx.fillStyle = deep;
  ctx.fillText("detail kecil, cerita besar", 66, 218);

  drawCover(ctx, decor, 64, 258, 464, 728);
  drawCover(ctx, kebaya, 552, 258, 464, 728);

  ctx.fillStyle = "#ffffff";
  roundRect(ctx, 88, 1006, 250, 42, 21);
  ctx.fill();
  ctx.fillStyle = "#2b2118";
  ctx.font = `600 22px ${SANS}`;
  ctx.fillText(data.decorName, 108, 1034);
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, 552, 1006, 464, 64, 8);
  ctx.fill();
  ctx.fillStyle = "#2b2118";
  wrap(ctx, data.kebayaName, 568, 1032, 432, 26);
  if (data.makeupName) {
    ctx.fillStyle = deep;
    ctx.font = `600 24px ${SANS}`;
    ctx.fillText(`Makeup · ${data.makeupName}`, 64, 1090);
  }

  ctx.fillStyle = "#2b2118";
  ctx.font = `700 34px ${SERIF}`;
  ctx.fillText(data.toneName, 64, 1132);
  data.toneHexes.forEach((hex, i) => {
    ctx.beginPath();
    ctx.arc(88 + i * 46, 1170, 17, 0, Math.PI * 2);
    ctx.fillStyle = hex;
    ctx.fill();
    ctx.strokeStyle = "rgba(43,33,24,0.25)";
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  ctx.font = `400 26px ${SANS}`;
  ctx.fillStyle = "rgba(43,33,24,0.65)";
  wrap(ctx, data.toneNote, 380, 1140, 636, 34);

  ctx.fillStyle = deep;
  roundRect(ctx, 64, 1246, W - 128, 66, 33);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = `600 26px ${SANS}`;
  ctx.fillText(`Konsultasi WhatsApp ${NEMPO_WA_NUMBER}`, 96, 1288);
  ctx.font = `400 22px ${SANS}`;
  ctx.fillStyle = "rgba(43,33,24,0.55)";
  ctx.fillText(`${NEMPO_INSTAGRAM_HANDLE} · nempo garut organizer`, 66, 1338);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(blob => (blob ? resolve(blob) : reject(new Error("Gagal membuat gambar moodboard"))), "image/png");
  });
}

export function moodboardFilename(toneName: string) {
  const slug = toneName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `moodboard-nempo-${slug}.png`;
}
