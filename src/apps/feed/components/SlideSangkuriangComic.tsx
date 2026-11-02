import pageTwentyArt from '@/assets/generated_images/cerita/sangkuriang-cutout-20.png';
import pageTwentyOneArt from '@/assets/generated_images/cerita/sangkuriang-cutout-21.webp';
import pageTwentyFourFullBodyArt from '@/assets/generated_images/cerita/sangkuriang-slide24-fullbody-trimmed.png';
import pageTwentyThreeArt from '@/assets/generated_images/cerita/sangkuriang-cutout-23.webp';
import pageTwentyFourArt from '@/assets/generated_images/cerita/sangkuriang-cutout-24.webp';
import pageTwentySixArt from '@/assets/generated_images/cerita/sangkuriang-cutout-26.png';
import familyPageTwentyOneArt from '@/assets/generated_images/cerita/sangkuriang-cutout-family-21.webp';
import huntPageTwentyTwoArt from '@/assets/generated_images/cerita/sangkuriang-hunt-slide22.webp';

type SangkuriangSlide = 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27;
type Dialogue = {
  speaker: string;
  text: string;
  side: 'left' | 'right';
};

const pages: Record<
  SangkuriangSlide,
  {
    title: string;
    narration: string;
    dialogues: [Dialogue, Dialogue];
    image: string;
    imageAlt: string;
    endNote?: string;
  }
> = {
  20: {
    title: 'Janji Dayang Sumbi',
    narration:
      'Dayang Sumbi tinggal di hutan dan mengisi hari dengan menenun. Suatu hari, torak—alat untuk mengatur benang—jatuh ke tanah. Ia bersumpah akan menikahi siapa pun yang mengambilkannya. Tumang, anjing setianya, segera membawa torak itu kembali.',
    dialogues: [
      {
        speaker: 'DAYANG SUMBI',
        text: 'Aduh, torakku jatuh! Siapa yang bisa mengambilkannya?',
        side: 'left',
      },
      { speaker: 'TUMANG', text: 'Guk! Aku menemukannya!', side: 'right' },
    ],
    image: pageTwentyArt,
    imageAlt:
      'Ilustrasi transparan Dayang Sumbi menenun bersama Tumang dan bayi Sangkuriang.',
  },
  21: {
    title: 'Keluarga Dayang Sumbi',
    narration:
      'Dayang Sumbi terkejut karena penolongnya seekor anjing, tetapi ia memilih menjaga sumpah. Dalam legenda ini, Tumang memiliki kesaktian. Mereka hidup bersama, lalu dikaruniai seorang putra bernama Sangkuriang. Dayang Sumbi membesarkannya di hutan, ditemani Tumang yang setia.',
    dialogues: [
      {
        speaker: 'DAYANG SUMBI',
        text: 'Sumpah itu harus kutepati, Tumang.',
        side: 'left',
      },
      {
        speaker: 'TUMANG',
        text: 'Aku akan menjaga kalian berdua.',
        side: 'right',
      },
    ],
    image: familyPageTwentyOneArt,
    imageAlt:
      'Dayang Sumbi menggendong bayi Sangkuriang dengan Tumang di sampingnya.',
  },
  22: {
    title: 'Perburuan di Hutan',
    narration:
      'Sangkuriang tumbuh dan berburu bersama Tumang. Dalam salah satu versi, Tumang tidak mengikuti perintah saat berburu. Sangkuriang marah, lalu membunuh anjing setianya.',
    dialogues: [
      {
        speaker: 'SANGKURIANG',
        text: 'Tumang, ikuti jejak buruan itu!',
        side: 'left',
      },
      {
        speaker: 'TUMANG',
        text: 'Guk! Guk! Aku di sini!',
        side: 'right',
      },
    ],
    image: huntPageTwentyTwoArt,
    imageAlt:
      'Sangkuriang menunjuk jejak buruan sementara Tumang berdiri di sampingnya.',
  },
  23: {
    title: 'Hati yang Dikenali',
    narration:
      'Sangkuriang pulang membawa hati hasil buruan. Dayang Sumbi mengenali hati Tumang; dalam duka, ia memukul kepala putranya dengan centong lalu mengusirnya. Bekas luka itu menjadi tanda perpisahan.',
    dialogues: [
      {
        speaker: 'SANGKURIANG',
        text: 'Ibu, ini hati hasil buruanku.',
        side: 'left',
      },
      {
        speaker: 'DAYANG SUMBI',
        text: 'Itu hati Tumang! Apa yang telah kau lakukan?',
        side: 'right',
      },
    ],
    image: pageTwentyOneArt,
    imageAlt:
      'Ilustrasi transparan Sangkuriang pergi setelah berpisah dari Dayang Sumbi.',
  },
  24: {
    title: 'Luka yang Dikenali',
    narration:
      'Bertahun-tahun kemudian, Sangkuriang kembali tanpa mengenali Dayang Sumbi. Mereka saling jatuh hati. Saat menyisir rambutnya, Dayang melihat bekas luka yang sama dan sadar ia adalah putranya.',
    dialogues: [
      {
        speaker: 'SANGKURIANG',
        text: 'Maukah kau menikah denganku?',
        side: 'left',
      },
      {
        speaker: 'DAYANG SUMBI',
        text: 'Bekas luka itu—kau Sangkuriang, putraku!',
        side: 'right',
      },
    ],
    image: pageTwentyFourFullBodyArt,
    imageAlt:
      'Ilustrasi transparan Dayang Sumbi mengenali bekas luka di kepala Sangkuriang.',
  },
  25: {
    title: 'Syarat Sebelum Fajar',
    narration:
      'Dayang Sumbi memberi dua syarat: bendung Sungai Citarum dan buat perahu besar sebelum fajar. Sangkuriang menyanggupi, memanggil makhluk gaib, lalu bekerja sepanjang malam. Sungai mulai tertahan dan perahu hampir rampung. Menjelang pagi, Dayang Sumbi sadar syarat mustahil itu mungkin terpenuhi.',
    dialogues: [
      {
        speaker: 'DAYANG SUMBI',
        text: 'Bendung Citarum dan buat perahu sebelum fajar.',
        side: 'left',
      },
      {
        speaker: 'SANGKURIANG',
        text: 'Aku akan memenuhi dua syarat itu!',
        side: 'right',
      },
    ],
    image: pageTwentyThreeArt,
    imageAlt:
      'Ilustrasi transparan Sangkuriang dan para makhluk gaib membangun perahu besar.',
  },
  26: {
    title: 'Malam yang Tampak Pagi',
    narration:
      'Dayang Sumbi meminta warga membentangkan kain merah di timur dan menumbuk padi agar suasana tampak seperti fajar. Ayam berkokok; makhluk gaib mengira pagi tiba lalu meninggalkan pekerjaan. Bendungan dan perahu belum selesai. Sangkuriang sadar dirinya telah dikelabui.',
    dialogues: [
      {
        speaker: 'DAYANG SUMBI',
        text: 'Bentangkan kain merah; tumbuk padi sekarang!',
        side: 'left',
      },
      {
        speaker: 'SANGKURIANG',
        text: 'Sedikit lagi, perahu dan bendungan selesai!',
        side: 'right',
      },
    ],
    image: pageTwentySixArt,
    imageAlt:
      'Dayang Sumbi dan warga membentangkan kain merah serta menumbuk padi saat Sangkuriang dan para makhluk gaib menyadari fajar palsu.',
  },
  27: {
    title: 'Perahu yang Terbalik',
    narration:
      'Sangkuriang murka lalu menendang perahu hingga terbalik. Dalam legenda, perahu itu berubah menjadi Gunung Tangkuban Parahu—penanda kegagalannya menggagalkan rencana Dayang Sumbi.',
    dialogues: [
      {
        speaker: 'SANGKURIANG',
        text: 'Aku ditipu! Perahu ini kutendang!',
        side: 'left',
      },
      {
        speaker: 'DAYANG SUMBI',
        text: 'Perahu itu akan menjadi tanda kisah kita.',
        side: 'right',
      },
    ],
    image: pageTwentyFourArt,
    imageAlt:
      'Ilustrasi transparan perahu besar yang terbalik saat Sangkuriang menendangnya.',
    endNote: 'Tangkuban Parahu berarti “perahu yang terbalik”.',
  },
};

export function SlideSangkuriangComic({
  slide,
}: {
  slide: SangkuriangSlide;
}) {
  const page = pages[slide];
  const pageNumber = slide - 19;
  const isSlideTwenty = slide === 20;
  const isSlideTwentyOne = slide === 21;
  const isSlideTwentyThree = slide === 23;
  const isSlideTwentyFour = slide === 24;
  const isSlideTwentyFive = slide === 25;
  const isSlideTwentySix = slide === 26;
  const isSlideTwentySeven = slide === 27;
  const usesSingleLineTitle = isSlideTwentyOne || isSlideTwentySix;
  const usesDialogueCards =
    slide === 21 ||
    slide === 23 ||
    slide === 24 ||
    slide === 25 ||
    slide === 27;
  const usesDialogueAboveArt = isSlideTwentyFive || isSlideTwentySix;
  const usesCenteredStoryLayout = isSlideTwentyThree || usesDialogueAboveArt;
  const usesRightSideLayout =
    isSlideTwenty ||
    isSlideTwentyOne ||
    slide === 22 ||
    isSlideTwentyFour ||
    isSlideTwentySeven;

  return (
    <section
      role="group"
      aria-label={`Komik legenda Sangkuriang, halaman ${pageNumber} dari 8: ${page.title}`}
      className="absolute inset-x-[1%] top-[1%] bottom-[7%] overflow-hidden text-left"
    >
      <div className="absolute inset-x-[5%] top-[2%] z-[3] text-center">
        <h2
          className={`mx-auto mt-[1.5%] ${
            isSlideTwenty
              ? 'max-w-[94%] text-[clamp(18px,4.9vw,25px)]'
              : usesSingleLineTitle
              ? 'max-w-[96%] whitespace-nowrap text-[clamp(15px,4.25vw,21px)]'
              : 'max-w-[92%] text-[clamp(17px,4.7vw,23px)]'
          } font-black leading-[1.02] tracking-[-0.035em] text-[#fff7e8] [text-shadow:0_2px_10px_rgba(39,20,27,0.42)]`}
          style={{ fontFamily: "'Bowlby One SC', 'DM Sans', sans-serif" }}
        >
          {page.title}
        </h2>

        <p
          className={`mx-auto mt-[2.2%] ${
            isSlideTwentyOne ? 'max-w-[94%]' : 'max-w-[90%]'
          } text-justify [text-justify:inter-word] ${
            isSlideTwenty
              ? 'text-[clamp(10px,2.45vw,12px)] leading-[1.58]'
              : 'text-[clamp(9px,2.35vw,11px)] leading-[1.55]'
          } font-semibold text-[#fff4e5] [text-shadow:0_1px_5px_rgba(39,20,27,0.65)]`}
        >
          {page.narration}
        </p>
      </div>

      {!isSlideTwentyOne && (
        <img
          src={page.image}
          alt={page.imageAlt}
          className={`sangkuriang-art pointer-events-none absolute z-[1] object-contain object-bottom ${
            isSlideTwenty
              ? 'bottom-[4%] right-0 h-[62%] w-[65%] max-w-[460px] drop-shadow-[0_14px_26px_rgba(24,13,10,0.38)]'
              : isSlideTwentyFour
              ? 'bottom-[3%] right-[2%] h-[45%] w-[58%]'
              : isSlideTwentySix
                ? 'bottom-[-6%] left-1/2 h-[48%] w-[62%] max-w-[430px] -translate-x-1/2'
              : isSlideTwentySeven
                 ? 'bottom-[6%] right-[1%] h-[33%] w-[68%] max-w-[430px]'
              : usesDialogueAboveArt
                 ? 'bottom-[8%] left-1/2 h-[32%] w-[50%] max-w-[360px] -translate-x-1/2'
            : usesCenteredStoryLayout
               ? 'bottom-[4%] left-1/2 h-[39%] w-[82%] max-w-[390px] -translate-x-1/2'
              : isSlideTwenty
                ? 'left-[6%] top-[38%] w-[39%]'
              : usesRightSideLayout
               ? 'bottom-[4%] right-[1%] h-[46%] w-[58%]'
              : 'bottom-[-1%] left-1/2 h-[79%] w-[96%] max-w-[390px] -translate-x-1/2'
          }`}
          draggable={false}
        />
      )}

      <div
        className={`absolute z-[2] ${
          usesDialogueCards
            ? `inset-x-[6%] ${
                isSlideTwentyThree || isSlideTwentyFour
                  ? 'top-[37%]'
                  : 'top-[42%]'
              } grid grid-cols-2 gap-[3%]`
            : usesCenteredStoryLayout
            ? usesDialogueAboveArt
              ? 'inset-x-[6%] top-[43%] grid grid-cols-2 gap-[4%]'
              : 'inset-x-[7%] top-[31%] grid grid-cols-2 gap-[5%]'
            : `flex flex-col gap-4 ${
                isSlideTwentyFour
                    ? 'left-[6%] top-[38%] w-[38%]'
                  : isSlideTwenty
                    ? 'left-[6%] top-[38%] w-[39%]'
                    : usesRightSideLayout
                    ? 'left-[6%] top-[38%] w-[45%]'
                    : 'inset-x-[6%] top-[39%]'
              }`
        }`}
      >
        {page.dialogues.map((dialogue, index) => (
          usesDialogueCards ? (
            <div
              key={`${dialogue.speaker}-${index}`}
              className="flex min-w-0 flex-col rounded-xl border border-[#f6d9b4]/35 bg-[#24171a]/65 px-[7%] py-[3%] text-left shadow-[0_4px_14px_rgba(20,10,12,0.2)] backdrop-blur-[2px]"
            >
              <span className="text-[6px] font-black tracking-[0.12em] text-[#f6d9b4] sm:text-[7px]">
                {dialogue.speaker}
              </span>
              <p className="mt-1 text-[clamp(9px,2.2vw,11px)] font-extrabold leading-[1.3] text-white">
                <span aria-hidden="true" className="text-[#f4d4a9]">“</span>
                {dialogue.text}
                <span aria-hidden="true" className="text-[#f4d4a9]">”</span>
              </p>
            </div>
          ) : usesRightSideLayout ? (
            <div
              key={`${dialogue.speaker}-${index}`}
              className="flex flex-col items-start text-left"
            >
              <span className="text-[6px] font-black tracking-[0.16em] text-[#f6d9b4] [text-shadow:0_1px_4px_rgba(37,20,27,0.85)] sm:text-[7px]">
                {dialogue.speaker}
              </span>
              <p className="mt-1 text-[clamp(9px,2.35vw,12px)] font-extrabold leading-[1.32] text-white [text-shadow:0_1px_5px_rgba(37,20,27,0.9)]">
                <span aria-hidden="true" className="text-[#f4d4a9]">
                  “
                </span>
                {dialogue.text}
                <span aria-hidden="true" className="text-[#f4d4a9]">
                  ”
                </span>
              </p>
            </div>
          ) : (
            <div
              key={`${dialogue.speaker}-${index}`}
              className={`flex ${
                usesCenteredStoryLayout ? 'w-full' : 'w-[72%]'
              } flex-col ${
                dialogue.side === 'right'
                  ? 'ml-auto items-end text-right'
                  : 'mr-auto items-start text-left'
              }`}
            >
              <span className="text-[6px] font-black tracking-[0.16em] text-[#f6d9b4] [text-shadow:0_1px_4px_rgba(37,20,27,0.85)] sm:text-[7px]">
                {dialogue.speaker}
              </span>
              <p className="mt-1 text-[clamp(9px,2.35vw,12px)] font-extrabold leading-[1.32] text-white [text-shadow:0_1px_5px_rgba(37,20,27,0.9)]">
                <span aria-hidden="true" className="text-[#f4d4a9]">
                  “
                </span>
                {dialogue.text}
                <span aria-hidden="true" className="text-[#f4d4a9]">
                  ”
                </span>
              </p>
            </div>
          )
        ))}
      </div>

      {page.endNote && (
        <p
          className={`absolute z-[3] text-[7px] font-extrabold leading-tight text-[#fff2dd] [text-shadow:0_1px_4px_rgba(37,20,27,0.9)] sm:text-[8px] ${
            isSlideTwentySeven
              ? 'left-1/2 top-[34%] w-max max-w-[88%] -translate-x-1/2 rounded-full border border-[#f6d9b4]/55 bg-[#2b1a1a]/70 px-[4%] py-[1.5%] text-center'
              : 'left-1/2 top-[28%] w-[84%] -translate-x-1/2 text-center'
          }`}
        >
          {page.endNote}
        </p>
      )}

      <div
        className="absolute bottom-2.5 left-3 right-3 z-[3] flex items-end justify-between gap-2 text-white [text-shadow:0_1px_4px_rgba(37,20,27,0.9)]"
      >
        <span className="text-[6px] font-black tracking-[0.16em] sm:text-[7px]">
          LEGENDA SUNDA · JAWA BARAT
        </span>
        <span className="text-right text-[6px] font-extrabold tracking-[0.1em] sm:text-[7px]">
          {page.endNote ? 'TAMAT' : 'LANJUTKAN KISAH →'}
        </span>
      </div>
    </section>
  );
}
