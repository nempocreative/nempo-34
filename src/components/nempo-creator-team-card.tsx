import { useEffect, useRef } from "react";
import { MessageCircle, MoveHorizontal } from "lucide-react";
import teamMember01 from "@/assets/team/team-member-01.jpg";
import teamMember02 from "@/assets/team/team-member-02.jpg";
import teamMember03 from "@/assets/team/team-member-03.jpg";
import teamMember04 from "@/assets/team/team-member-04.jpg";
import teamMember05 from "@/assets/team/team-member-05.jpg";
import teamMember06 from "@/assets/team/team-member-06.jpg";
import teamMember07 from "@/assets/team/team-member-07.jpg";
import teamMember08 from "@/assets/team/team-member-08.jpg";
import teamMember09 from "@/assets/team/team-member-09.jpg";
import teamMember10 from "@/assets/team/team-member-10.jpg";
import teamMember11 from "@/assets/team/team-member-11.jpg";
import teamMember12 from "@/assets/team/team-member-12.jpg";
import teamMember13 from "@/assets/team/team-member-13.jpg";
import teamMember14 from "@/assets/team/team-member-14.jpg";
import teamMember15 from "@/assets/team/team-member-15.jpg";
import { NEMPO_CONSULT_URL } from "@/lib/contact";
import "./nempo-creator-team-card.css";


type TeamProfile = {
  image: string;
  name: string;
  field: string;
  color: string;
};


/* Foto tim asli (wajah tetap, busana formal hasil AI). Nama sementara — ganti dengan nama asli. */
const realTeamProfiles: TeamProfile[] = [
  { image: teamMember01, name: "Tim Nempo", field: "Creative Lead", color: "linear-gradient(135deg, #0891b2, #0e7490)" },
  { image: teamMember02, name: "Tim Nempo", field: "Videographer", color: "linear-gradient(135deg, #ea580c, #c2410c)" },
  { image: teamMember03, name: "Tim Nempo", field: "Social Media", color: "linear-gradient(135deg, #059669, #047857)" },
  { image: teamMember04, name: "Tim Nempo", field: "Content Creator", color: "linear-gradient(135deg, #2563eb, #1d4ed8)" },
  { image: teamMember05, name: "Tim Nempo", field: "Designer", color: "linear-gradient(135deg, #8b5cf6, #6d28d9)" },
  { image: teamMember06, name: "Tim Nempo", field: "Photographer", color: "linear-gradient(135deg, #db2777, #be185d)" },
  { image: teamMember07, name: "Tim Nempo", field: "Video Editor", color: "linear-gradient(135deg, #4f46e5, #3730a3)" },
  { image: teamMember08, name: "Tim Nempo", field: "Social Media", color: "linear-gradient(135deg, #059669, #047857)" },
  { image: teamMember09, name: "Tim Nempo", field: "Videographer", color: "linear-gradient(135deg, #ea580c, #c2410c)" },
  { image: teamMember10, name: "Tim Nempo", field: "Creative Lead", color: "linear-gradient(135deg, #0891b2, #0e7490)" },
  { image: teamMember11, name: "Tim Nempo", field: "Content Creator", color: "linear-gradient(135deg, #2563eb, #1d4ed8)" },
  { image: teamMember12, name: "Tim Nempo", field: "Event Creator", color: "linear-gradient(135deg, #d97706, #b45309)" },
  { image: teamMember13, name: "Tim Nempo", field: "Wedding Creator", color: "linear-gradient(135deg, #e11d48, #be123c)" },
  { image: teamMember14, name: "Tim Nempo", field: "Photographer", color: "linear-gradient(135deg, #db2777, #be185d)" },
  { image: teamMember15, name: "Tim Nempo", field: "Event Creator", color: "linear-gradient(135deg, #d97706, #b45309)" },
];

const teamProfiles: TeamProfile[] = realTeamProfiles;

/* Daftar digandakan supaya jalannya otomatis terasa tanpa putus. */
const loopProfiles = [...teamProfiles, ...teamProfiles];

const AUTO_SPEED = 34; // piksel per detik
const MAX_FLICK = 2600; // batas kecepatan lemparan saat lepas sentuh

export function NempoCreatorTeamCard() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const firstCard = track?.firstElementChild;
    if (!viewport || !track || !(firstCard instanceof HTMLElement)) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const total = teamProfiles.length;

    let step = 0;
    let setWidth = 0;
    let offset = 0;
    let velocity = 0;
    let dragging = false;
    let activePointer: number | null = null;
    let startX = 0;
    let startOffset = 0;
    let lastTime = 0;
    let hovering = false;
    let focused = false;
    let frame = 0;
    let previous = performance.now();

    const wrap = (value: number) => {
      if (setWidth <= 0) return 0;
      const wrapped = value % setWidth;
      return wrapped < 0 ? wrapped + setWidth : wrapped;
    };

    const apply = () => {
      track.style.transform = `translate3d(${-offset}px, 0, 0)`;
    };

    const measure = () => {
      const cardWidth = firstCard.getBoundingClientRect().width;
      const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0;
      step = cardWidth + gap;
      setWidth = step * total;
      offset = wrap(offset);
      apply();
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);

    const tick = (now: number) => {
      const delta = Math.min(80, now - previous) / 1000;
      previous = now;
      if (!dragging) {
        if (Math.abs(velocity) > 3) {
          offset = wrap(offset + velocity * delta);
          velocity *= Math.pow(0.0015, delta);
        } else {
          velocity = 0;
          if (
            !hovering &&
            !focused &&
            !reducedMotion.matches &&
            document.visibilityState === "visible"
          ) {
            offset = wrap(offset + AUTO_SPEED * delta);
          }
        }
        apply();
      }
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      dragging = true;
      activePointer = event.pointerId;
      startX = event.clientX;
      startOffset = offset;
      lastTime = event.timeStamp;
      velocity = 0;
      viewport.classList.add("is-dragging");
      try {
        viewport.setPointerCapture(event.pointerId);
      } catch {
        /* pointer capture tidak selalu tersedia */
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging || event.pointerId !== activePointer) return;
      const before = offset;
      const delta = Math.max(8, event.timeStamp - lastTime) / 1000;
      offset = wrap(startOffset - (event.clientX - startX));
      let shift = offset - before;
      if (shift > setWidth / 2) shift -= setWidth;
      if (shift < -setWidth / 2) shift += setWidth;
      velocity = Math.max(-MAX_FLICK, Math.min(MAX_FLICK, shift / delta));
      lastTime = event.timeStamp;
      apply();
    };

    const endDrag = (event: PointerEvent) => {
      if (!dragging || event.pointerId !== activePointer) return;
      dragging = false;
      activePointer = null;
      viewport.classList.remove("is-dragging");
      if (event.type === "pointercancel") velocity = 0;
    };

    const onPointerEnter = (event: PointerEvent) => {
      if (event.pointerType === "mouse") hovering = true;
    };
    const onPointerLeave = (event: PointerEvent) => {
      if (event.pointerType === "mouse") hovering = false;
    };
    const onFocusIn = () => {
      focused = true;
    };
    const onFocusOut = (event: FocusEvent) => {
      const next = event.relatedTarget;
      if (!(next instanceof Node) || !viewport.contains(next)) focused = false;
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      offset = wrap(offset + (event.key === "ArrowRight" ? step : -step));
      apply();
    };

    viewport.addEventListener("pointerdown", onPointerDown);
    viewport.addEventListener("pointermove", onPointerMove);
    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);
    viewport.addEventListener("pointerenter", onPointerEnter);
    viewport.addEventListener("pointerleave", onPointerLeave);
    viewport.addEventListener("focusin", onFocusIn);
    viewport.addEventListener("focusout", onFocusOut);
    viewport.addEventListener("keydown", onKeyDown);

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      viewport.removeEventListener("pointerdown", onPointerDown);
      viewport.removeEventListener("pointermove", onPointerMove);
      viewport.removeEventListener("pointerup", endDrag);
      viewport.removeEventListener("pointercancel", endDrag);
      viewport.removeEventListener("pointerenter", onPointerEnter);
      viewport.removeEventListener("pointerleave", onPointerLeave);
      viewport.removeEventListener("focusin", onFocusIn);
      viewport.removeEventListener("focusout", onFocusOut);
      viewport.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <section
      id="creator-team"
      aria-label="Nempo Creative Team"
      className="nempo-creator-team"
    >
      <header className="nempo-creator-team__header">
        <div className="nempo-creator-team__intro">
          <h2 className="nempo-creator-team__title" id="creative-team-title">
            Nempo Creative Team
          </h2>
          <p className="nempo-creator-team__service">
            Wedding, konten, desain, event — satu tim kreatif
          </p>
        </div>

        <a
          className="nempo-creator-team__contact"
          href={NEMPO_CONSULT_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Hubungi Nempo melalui Instagram"
        >
          <MessageCircle aria-hidden="true" />
          <span>Tanya tim</span>
        </a>
      </header>

      <div
        className="nempo-creator-team__carousel-row"
        aria-label="Nempo Creative Team"
        aria-roledescription="carousel"
      >
        <div
          className="nempo-creator-team__viewport"
          ref={viewportRef}
          role="group"
          tabIndex={0}
          aria-label="Daftar tim Nempo. Geser ke kiri atau kanan, atau tekan tombol panah."
        >
          <div className="nempo-creator-team__track" ref={trackRef}>
            {loopProfiles.map((profile, index) => {
              const isClone = index >= teamProfiles.length;
              return (
                <article
                  className="nempo-creator-team__card"
                  key={`${profile.name}-${index}`}
                  aria-hidden={isClone}
                >
                  <div className="nempo-creator-team__portrait">
                    <img
                      src={profile.image}
                      alt={`Anggota tim Nempo — ${profile.field}`}
                      loading="eager"
                      draggable={false}
                    />
                    <span
                      className="nempo-creator-team__role-flag"
                      style={{ background: profile.color }}
                    >
                      {profile.field}
                    </span>
                  </div>
                  <p className="nempo-creator-team__name">{profile.name}</p>
                </article>
              );
            })}
          </div>
        </div>

        <span className="nempo-creator-team__hint" aria-hidden="true">
          <MoveHorizontal aria-hidden="true" />
          <span>Geser</span>
        </span>
      </div>
    </section>
  );
}
