import { useState, type RefObject } from 'react';
import QRCode from 'react-qr-code';
import ggsHairHeader from '@/assets/generated_images/ggs-beauty-double-braid-edge-connected-4x5-20261012.png';

const assetBase = "/nempo-feed/";

type GgsMemberCardDesignerProps = {
  exportRef: RefObject<HTMLElement | null>;
};

export function GgsMemberCardDesigner({ exportRef }: GgsMemberCardDesignerProps) {
  const [memberName, setMemberName] = useState('NAMA MEMBER');
  const [memberId, setMemberId] = useState('GGS-000001');
  const cardMemberId = memberId.trim() || 'GGS-000001';

  return (
    <section className="mx-auto flex w-full max-w-[1040px] flex-col items-center gap-4 px-3 pb-6 sm:px-6">
      <div className="flex w-full max-w-[920px] flex-wrap items-end justify-between gap-2">
        <div>
          <p className="m-0 text-[10px] font-black uppercase tracking-[0.18em] text-[#71133f] sm:text-xs">
            GGS BEAUTY · MEMBER CARD
          </p>
          <p className="m-0 mt-1 text-[11px] text-[#71133f] sm:text-xs">
            Template kartu standar CR80 · 85,6 × 54 mm
          </p>
        </div>
        <span className="rounded-full border border-[#e9c581] bg-white/80 px-3 py-1 text-[9px] font-bold tracking-[0.12em] text-[#71133f]">
          PREVIEW CETAK
        </span>
      </div>

      <main
        ref={exportRef}
        aria-label="Desain kartu member GGS Beauty"
        className="relative isolate mx-auto aspect-[85.6/54] w-full max-w-[920px] overflow-hidden rounded-[20px] bg-[#FC46AA] text-[#5a1236] shadow-[0_24px_70px_rgba(84,20,49,0.22)] ring-1 ring-[#d9b56f]/70"
        style={{
          containerType: 'inline-size',
          backgroundColor: '#FC46AA',
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact',
        }}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[82%] overflow-hidden"
          aria-hidden="true"
        >
          <img
            src={ggsHairHeader}
            alt=""
            className="h-full w-full object-cover object-top opacity-80 mix-blend-multiply"
            draggable={false}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, rgba(252,70,170,0.03) 0%, rgba(252,70,170,0.08) 60%, #FC46AA 100%)',
            }}
          />
        </div>
        <div
          className="pointer-events-none absolute -bottom-[45%] left-[35%] z-[1] h-[105%] w-[45%] rounded-full border border-white/35"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-[52%] left-[41%] z-[1] h-[105%] w-[38%] rounded-full border border-[#8d315d]/15"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-[1.4%] z-[3] rounded-[2.4cqw] border border-[#e8c778]/80"
          aria-hidden="true"
        />

        <img
          src={`${assetBase}assets/ggs-beauty-logo.png`}
          alt=""
          aria-hidden="true"
          className="absolute left-[7.2%] top-[9%] z-10 w-[14%] object-contain drop-shadow-[0_3px_3px_rgba(84,20,49,0.14)]"
          draggable={false}
        />

        <div className="absolute left-[25%] top-[15%] z-10">
          <p
            className="m-0 font-sans font-black uppercase leading-none tracking-[0.2em] text-[#71133f]"
            style={{ fontSize: '1.8cqw' }}
          >
            GGS BEAUTY
          </p>
          <h1
            className="m-0 mt-[1.5%] font-sans font-black leading-none tracking-[-0.035em] text-[#5a1236]"
            style={{ fontSize: '5.8cqw' }}
          >
            MEMBER CARD
          </h1>
          <p
            className="m-0 mt-[1.7%] font-sans font-semibold leading-none tracking-[0.04em] text-[#71133f]"
            style={{ fontSize: '2.2cqw' }}
          >
            Grooming is better
          </p>
        </div>

        <div className="absolute bottom-[11%] left-[7.5%] z-10 max-w-[58%]">
          <p
            className="m-0 font-sans font-bold uppercase leading-none tracking-[0.18em] text-[#71133f]"
            style={{ fontSize: '1.35cqw' }}
          >
            NAMA MEMBER
          </p>
          <p
            className="m-0 mt-[1.2%] truncate font-sans font-black uppercase leading-none tracking-[0.035em] text-[#5a1236]"
            style={{ fontSize: '3.4cqw' }}
          >
            {memberName.trim() || 'NAMA MEMBER'}
          </p>
          <p
            className="m-0 mt-[2.4%] font-sans font-semibold leading-none tracking-[0.12em] text-[#71133f]"
            style={{ fontSize: '1.6cqw' }}
          >
            MEMBER ID · {cardMemberId}
          </p>
        </div>

        <div className="absolute right-[4.2%] top-[12%] z-20 flex h-[76%] w-[23%] flex-col items-center justify-center rounded-[2.1cqw] bg-white p-[1.7%] shadow-[0_8px_24px_rgba(84,20,49,0.18)] ring-1 ring-[#e8c778]">
          <div className="flex w-full flex-1 items-center justify-center rounded-[1.25cqw] bg-white p-[4%]">
            <QRCode
              value={`GGS-MEMBER|${cardMemberId}`}
              size={256}
              level="M"
              bgColor="#ffffff"
              fgColor="#5a1236"
              style={{ display: 'block', height: '100%', maxHeight: '100%', maxWidth: '100%', width: '100%' }}
            />
          </div>
          <p
            className="m-0 mt-[3%] font-sans font-black uppercase leading-none tracking-[0.16em] text-[#5a1236]"
            style={{ fontSize: '1.35cqw' }}
          >
            SCAN MEMBER
          </p>
        </div>
      </main>

      <div className="grid w-full max-w-[920px] gap-3 rounded-2xl border border-[#f0d9e3] bg-white/90 p-4 shadow-sm sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-[11px] font-bold text-[#5a1236]">
          Nama member
          <input
            value={memberName}
            onChange={(event) => setMemberName(event.target.value)}
            maxLength={28}
            className="h-10 rounded-xl border border-[#e8cad7] bg-white px-3 text-sm font-medium outline-none transition focus:border-[#d33c89] focus:ring-2 focus:ring-[#FC46AA]/15"
            placeholder="Nama di kartu"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-[11px] font-bold text-[#5a1236]">
          ID member
          <input
            value={memberId}
            onChange={(event) => setMemberId(event.target.value)}
            maxLength={24}
            className="h-10 rounded-xl border border-[#e8cad7] bg-white px-3 text-sm font-medium outline-none transition focus:border-[#d33c89] focus:ring-2 focus:ring-[#FC46AA]/15"
            placeholder="GGS-000001"
          />
        </label>
        <p className="m-0 text-[10px] leading-relaxed text-[#71133f] sm:col-span-2">
          QR saat ini berisi kode contoh untuk layout kartu. Pemindaian website dan database poin belum dihubungkan.
        </p>
      </div>
    </section>
  );
}

export default GgsMemberCardDesigner;
