import type { RefObject } from 'react';

const YEAR = 2027;
const assetBase = "/nempo-feed/";

const months = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const weekdays = ['MIN', 'SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB'];

function getMonthDates(monthIndex: number) {
  const firstWeekday = new Date(Date.UTC(YEAR, monthIndex, 1)).getUTCDay();
  const daysInMonth = new Date(
    Date.UTC(YEAR, monthIndex + 1, 0),
  ).getUTCDate();

  return Array.from({ length: 42 }, (_, cellIndex) => {
    const day = cellIndex - firstWeekday + 1;
    return day < 1 || day > daysInMonth ? null : day;
  });
}

export function Ggs2027Calendar({
  exportRef,
}: {
  exportRef: RefObject<HTMLElement | null>;
}) {
  return (
    <main
      ref={exportRef}
      className="relative isolate aspect-[5/7] h-[min(92vh,900px)] w-auto max-w-full overflow-hidden bg-[#f8c5da] text-[#452338] shadow-[0_24px_70px_rgba(111,43,76,0.18)] max-[640px]:h-auto max-[640px]:w-full"
      style={{
        containerType: 'inline-size',
        fontFamily: "'DM Sans', 'Inter', sans-serif",
      }}
      aria-label="Kalender GGS Beauty tahun 2027 ukuran 50 kali 70 sentimeter, seluruh dua belas bulan dalam satu lembar"
    >
      <div className="absolute inset-[2.4%] flex flex-col overflow-hidden border border-[#e7b2c6] bg-[#fff0f6] px-[3.1%] py-[2.4%]">
        <header className="grid h-[13%] shrink-0 grid-cols-[56%_44%]">
          <div className="flex min-w-0 items-center gap-[4%] pr-[4%]">
            <div className="shrink-0">
              <div className="flex items-start">
                <p className="font-serif text-[9.4cqi] font-medium uppercase leading-[0.78] tracking-[-0.075em] text-[#452338]">
                  GGS
                </p>
                <span className="ml-[1.5%] mt-[0.7%] text-[1.9cqi] leading-none text-[#fc46aa]">
                  ✦
                </span>
              </div>
              <p className="mt-[3%] whitespace-nowrap text-[1.65cqi] font-semibold uppercase leading-none tracking-[0.34em] text-[#735064]">
                Beauty Salon
              </p>
            </div>
            <span className="h-[58%] w-px shrink-0 bg-[#d58da9]" />
            <p className="font-serif text-[3.1cqi] italic leading-[1.12] text-[#6f3d57]">
              Grooming
              <br />
              is Better
            </p>
          </div>
          <figure className="relative h-full min-w-0 overflow-hidden">
            <img
              src={`${assetBase}assets/ggs-calendar-hair-treatment.webp`}
              alt="Ilustrasi editorial perawatan rambut salon"
              className="h-full w-full object-cover object-[53%_52%]"
              draggable={false}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-[#fff0f6]/20"
            />
          </figure>
        </header>

        <section
          aria-label="Kolase foto layanan, tim, dan salon GGS Beauty"
          className="mt-[0.7%] flex h-[18.5%] shrink-0 flex-col gap-[0.55%] overflow-hidden"
        >
          <div className="grid min-h-0 flex-1 grid-cols-[1.05fr_0.9fr_0.95fr_1fr_1.15fr] gap-[0.55%]">
            <img
              src={`${assetBase}assets/ggs-calendar-hair-treatment.webp`}
              alt="Ilustrasi perawatan rambut pelanggan"
              className="h-full w-full object-cover object-[50%_78%]"
              draggable={false}
            />
            <img
              src={`${assetBase}assets/ggs-calendar-employee-documentation.webp`}
              alt="Terapis GGS Beauty"
              className="h-full w-full object-cover object-[22%_45%]"
              draggable={false}
            />
            <img
              src={`${assetBase}assets/ggs-calendar-service-documentation.webp`}
              alt="Layanan spa GGS Beauty"
              className="h-full w-full object-cover object-[60%_70%]"
              draggable={false}
            />
            <img
              src={`${assetBase}assets/ggs-calendar-team.webp`}
              alt="Tiga model menampilkan gaya rambut berbeda"
              className="h-full w-full object-cover object-[50%_58%] saturate-[0.72]"
              draggable={false}
            />
            <img
              src={`${assetBase}assets/ggs-calendar-storefront-strip.webp`}
              alt="Detail salon GGS Beauty"
              className="h-full w-full object-cover object-[60%_50%]"
              draggable={false}
            />
          </div>
          <div className="grid min-h-0 flex-1 grid-cols-[1.2fr_1fr_1.05fr_1fr] gap-[0.55%]">
            <img
              src={`${assetBase}assets/ggs-beauty-storefront-documentation.webp`}
              alt="Tampak depan salon GGS Beauty"
              className="h-full w-full object-cover object-[center_78%]"
              draggable={false}
            />
            <img
              src={`${assetBase}assets/ggs-feed-06-spa-background.webp`}
              alt="Perawatan spa pelanggan"
              className="h-full w-full object-cover object-[50%_78%]"
              draggable={false}
            />
            <img
              src={`${assetBase}assets/ggs-calendar-service-documentation.webp`}
              alt="Detail perawatan spa GGS"
              className="h-full w-full object-cover object-[72%_50%]"
              draggable={false}
            />
            <img
              src={`${assetBase}assets/ggs-calendar-hair-treatment.webp`}
              alt="Ilustrasi stylist merawat rambut pelanggan"
              className="h-full w-full object-cover object-[75%_75%]"
              draggable={false}
            />
          </div>
        </section>

        <section className="relative mt-[0.1%] flex h-[14%] shrink-0 flex-col items-center justify-center text-center">
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute -top-[12%] left-0 z-[1] h-[23%] w-full"
            viewBox="0 0 100 20"
            preserveAspectRatio="none"
          >
            <path
              d="M0 7 C17 18 32 14 50 3 C67 -7 83 17 100 6 V20 H0 Z"
              fill="#fff0f6"
            />
          </svg>
          <span className="relative z-[2] font-serif text-[15.5cqi] font-medium leading-[0.82] tracking-[-0.055em] text-[#7e2850]">
            {YEAR}
          </span>
          <div className="relative z-[2] mt-[1.6%] flex w-full items-center justify-center gap-[3%]">
            <span className="h-px w-[16%] bg-[#d795b0]" />
            <span className="text-[1.55cqi] font-semibold uppercase leading-none tracking-[0.42em] text-[#75445f]">
              Calendar
            </span>
            <span className="h-px w-[16%] bg-[#d795b0]" />
          </div>
        </section>

        <div
          className="mt-[1.4%] grid min-h-0 flex-1 grid-cols-4 grid-rows-3 gap-x-[2.2%] gap-y-[2.4%]"
          aria-label="Dua belas bulan kalender 2027"
        >
          {months.map((month, monthIndex) => (
            <section
              key={month}
              aria-label={`${month} ${YEAR}`}
              className="flex min-h-0 flex-col overflow-hidden rounded-[1.2cqi] border border-[#f0c2d5] bg-[#fff8fb] px-[2.8%] pb-[2.2%] pt-[2%] shadow-[0_1px_5px_rgba(150,53,101,0.08)]"
            >
              <div className="flex shrink-0 items-center gap-[3.5%] border-b border-[#f0d2df] pb-[2.2%]">
                <span className="grid aspect-square w-[4.2cqi] shrink-0 place-items-center rounded-full border border-[#f4c7d9] bg-[#fde8f0] font-serif text-[1.8cqi] font-semibold leading-none text-[#b5326e]">
                  {String(monthIndex + 1).padStart(2, '0')}
                </span>
                <h2 className="whitespace-nowrap pb-[0.1%] font-serif text-[2.05cqi] font-semibold uppercase leading-none tracking-[0.015em] text-[#492437]">
                  {month}
                </h2>
                <span className="ml-auto h-[0.55cqi] w-[6%] shrink-0 rounded-full bg-[#fc46aa]" />
              </div>

              <div className="mb-[2%] mt-[2.5%] grid grid-cols-7 rounded-[0.7cqi] bg-[#fdebf2] py-[2%]">
                {weekdays.map((weekday, weekdayIndex) => (
                  <span
                    key={`${month}-${weekday}`}
                      className="text-center text-[1.2cqi] font-bold uppercase leading-none tracking-[-0.02em]"
                    style={{
                      color: weekdayIndex === 0 ? '#b5326e' : '#9a788a',
                    }}
                  >
                    {weekday}
                  </span>
                ))}
              </div>

              <div className="grid min-h-0 flex-1 grid-cols-7 grid-rows-6">
                {getMonthDates(monthIndex).map((day, cellIndex) => (
                  <span
                    key={`${month}-${cellIndex}`}
                    aria-hidden={day === null}
                    className={`grid place-items-center text-[1.7cqi] leading-none tabular-nums ${
                      cellIndex % 7 === 0
                        ? 'font-semibold text-[#b5326e]'
                        : 'font-medium text-[#4b3b48]'
                    }`}
                  >
                    {day}
                  </span>
                ))}
              </div>
            </section>
          ))}
        </div>

        <footer className="mt-[1.2%] shrink-0">
          <div className="grid grid-cols-3 border-y border-[#e4b8cb] py-[1.2%] text-center text-[1.25cqi] font-semibold uppercase leading-tight tracking-[0.08em] text-[#765366]">
            <span className="border-r border-[#edcdda] px-[2%]">
              Beauty in Every Detail
            </span>
            <span className="border-r border-[#edcdda] px-[2%]">
              Professional &amp; Friendly Team
            </span>
            <span className="px-[2%]">Your Beauty, Our Priority</span>
          </div>
          <p className="mt-[1.3%] text-center font-serif text-[1.6cqi] italic leading-none text-[#a24671]">
            Together We Grow
          </p>
        </footer>
      </div>
    </main>
  );
}
