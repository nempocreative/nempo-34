import pdfMake from 'pdfmake/build/pdfmake.js';
import pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { videoScenes } from '@/apps/mou/pages/nasution-boy';

const COLORS = {
  ink: '#463628',
  brown: '#805538',
  brownText: '#72583d',
  gold: '#b18a5b',
  cream: '#f6f0e6',
  warmWhite: '#fffdf9',
  panel: '#fbf9f4',
  border: '#e8dfd0',
  body: '#5f5549',
  muted: '#9b7952',
  white: '#fffaf3',
  paleGold: '#e2c79f',
};

pdfMake.addVirtualFileSystem(pdfFonts);

function borderlessLayout() {
  return {
    hLineWidth: () => 0,
    vLineWidth: () => 0,
    paddingLeft: () => 0,
    paddingRight: () => 0,
    paddingTop: () => 0,
    paddingBottom: () => 0,
  };
}

function borderedLayout(color = COLORS.border) {
  return {
    hLineWidth: () => 0.6,
    vLineWidth: () => 0.6,
    hLineColor: () => color,
    vLineColor: () => color,
    paddingLeft: () => 0,
    paddingRight: () => 0,
    paddingTop: () => 0,
    paddingBottom: () => 0,
  };
}

function sectionPanel(
  title: string,
  content: unknown[],
  fillColor = COLORS.panel,
  headingStyle = 'sectionLabel',
) {
  return {
    table: {
      widths: ['*'],
      body: [[{
        stack: [
          { text: title.toUpperCase(), style: headingStyle, margin: [0, 0, 0, 5] },
          ...content,
        ],
        fillColor,
        margin: [8, 7, 8, 7],
      }]],
    },
    layout: borderedLayout(),
    margin: [0, 0, 0, 8],
  };
}

function quoteBox(content: unknown[]) {
  return {
    table: {
      widths: ['*'],
      body: [[{
        stack: content,
        fillColor: '#ffffff',
        margin: [7, 6, 7, 6],
        borderColor: [COLORS.gold, COLORS.border, COLORS.border, COLORS.border],
      }]],
    },
    layout: borderedLayout(),
    margin: [0, 0, 0, 6],
  };
}

function createHero() {
  return {
    table: {
      widths: ['*', 142],
      body: [[
        {
          stack: [
            { text: 'VIDEO FEED IG + TIKTOK', style: 'heroKicker' },
            { text: 'Nasution Boy', style: 'heroTitle', margin: [0, 6, 0, 0] },
            { text: 'JAZTIFY MOBILE LEGEND TOURNAMENT 2026', style: 'heroEvent', margin: [0, 3, 0, 0] },
            {
              text: 'Konsep video vertikal: berawal dari konten Jazy yang membuat Nasution Boy dan tim penasaran, lalu datang ke Beri Kopi untuk mendaftar dan mencoba aktivasi.',
              style: 'heroIntro',
              margin: [0, 7, 0, 0],
            },
          ],
          fillColor: COLORS.ink,
          margin: [14, 13, 8, 13],
        },
        {
          stack: [
            { text: 'PLATFORM', style: 'heroMetaLabel' },
            { text: 'IG Reels (Feed) + TikTok', style: 'heroMetaValue', margin: [0, 2, 0, 8] },
            { text: 'URUTAN VIDEO', style: 'heroMetaLabel' },
            { text: `${videoScenes.length} scene`, style: 'heroMetaValue', margin: [0, 2, 0, 0] },
          ],
          fillColor: COLORS.ink,
          margin: [10, 13, 12, 13],
        },
      ]],
    },
    layout: borderlessLayout(),
    margin: [0, 0, 0, 12],
  };
}

function createStoryFlow() {
  return {
    table: {
      widths: videoScenes.map(() => '*'),
      body: [[
        ...videoScenes.map((scene) => ({
          text: `${scene.number}   ${scene.stage}`,
          alignment: 'center',
          style: 'flowItem',
          fillColor: '#ffffff',
          margin: [6, 6, 6, 6],
        })),
      ]],
    },
    layout: borderedLayout(),
    margin: [0, 0, 0, 12],
  };
}

function createSceneHeading(scene: (typeof videoScenes)[number], pageBreak: boolean) {
  return {
    table: {
      widths: [55, '*'],
      body: [[
        {
          stack: [
            { text: scene.number, style: 'sceneNumber' },
            { text: scene.stage, style: 'sceneStage', margin: [0, 3, 0, 0] },
          ],
          fillColor: COLORS.cream,
          margin: [9, 8, 9, 8],
        },
        {
          stack: [
            { text: `SCENE ${scene.number}`, style: 'sceneKicker' },
            { text: scene.title, style: 'sceneTitle', margin: [0, 3, 0, 0] },
          ],
          fillColor: '#ffffff',
          margin: [10, 8, 10, 8],
        },
      ]],
    },
    layout: borderedLayout(),
    margin: [0, 0, 0, 8],
    ...(pageBreak ? { pageBreak: 'before' } : {}),
  };
}

function createShootContent(scene: (typeof videoScenes)[number]) {
  return [
    { text: scene.visual, style: 'body', margin: [0, 0, 0, 8] },
    {
      columns: [
        { text: 'RINCIAN SHOOT', style: 'sectionLabel', margin: [0, 0, 0, 5] },
        {
          text: `${scene.shootDetails.length} SHOT`,
          style: 'sectionLabel',
          alignment: 'right',
          margin: [0, 0, 0, 5],
        },
      ],
    },
    ...scene.shootDetails.map((shot, index) => ({
      columns: [
        {
          width: 18,
          text: String(index + 1).padStart(2, '0'),
          style: 'shotNumber',
        },
        {
          width: '*',
          stack: [
            { text: shot.framing, style: 'shotTitle' },
            { text: shot.action, style: 'shotBody', margin: [0, 1, 0, 0] },
          ],
        },
      ],
      columnGap: 5,
      margin: [0, 0, 0, 6],
    })),
  ];
}

function createScriptPanel(scene: (typeof videoScenes)[number]) {
  const quotes = scene.lines.map((line) =>
    quoteBox([
      ...(line.speaker
        ? [{ text: line.speaker, style: 'quoteSpeaker', margin: [0, 0, 0, 3] }]
        : []),
      { text: line.text, style: 'quote' },
    ]),
  );

  return sectionPanel(scene.scriptType, quotes);
}

function createSceneColumns(scene: (typeof videoScenes)[number]) {
  const rightColumn: unknown[] = [createScriptPanel(scene)];

  if (scene.registrationFlow) {
    rightColumn.push(
      sectionPanel(
        'Alur pendaftaran',
        scene.registrationFlow.map((step, index) => ({
          text: [
            { text: `${index + 1}. `, bold: true, color: COLORS.brown },
            { text: step },
          ],
          style: 'body',
          margin: [0, 0, 0, 3],
        })),
        '#fffdf8',
      ),
    );
  }

  if (scene.entryRequirement) {
    rightColumn.push(
      sectionPanel(
        'Syarat kategori',
        [{ text: scene.entryRequirement, style: 'body' }],
        '#f7f1e7',
      ),
    );
  }

  if (scene.productReference) {
    rightColumn.push(
      sectionPanel(
        'Referensi produk dari brief',
        [
          { text: scene.productReference.name, style: 'detailHeading' },
          { text: scene.productReference.priceAndQuantity, style: 'body', margin: [0, 2, 0, 0] },
          { text: scene.productReference.message, style: 'body', italics: true, margin: [0, 2, 0, 0] },
        ],
        COLORS.cream,
      ),
    );
  }

  if (scene.tournamentInfo) {
    rightColumn.push(
      sectionPanel(
        'Format & hadiah',
        [{ text: scene.tournamentInfo, style: 'body' }],
      ),
    );
  }

  if (scene.screenText) {
    rightColumn.push(
      sectionPanel(
        'Teks layar',
        [{ text: `“${scene.screenText}”`, style: 'detailHeading' }],
        '#f2e8d8',
      ),
    );
  }

  if (scene.cta) {
    rightColumn.push(
      sectionPanel(
        'CTA di layar',
        [{ text: `“${scene.cta}”`, style: 'lightQuote' }],
        COLORS.ink,
        'lightSectionLabel',
      ),
    );
  }

  if (scene.hashtags) {
    rightColumn.push(
      sectionPanel(
        'Hashtag',
        [{ text: scene.hashtags.join('    '), style: 'hashtag' }],
        '#ffffff',
      ),
    );
  }

  return {
    columns: [
      {
        width: '*',
        stack: [
          sectionPanel('Arah visual', createShootContent(scene)),
        ],
      },
      {
        width: '*',
        stack: rightColumn,
      },
    ],
    columnGap: 9,
  };
}

export async function downloadNasutionBoyPdf() {
  if (videoScenes.length === 0) {
    throw new Error('Konten storyline belum siap untuk diunduh.');
  }

  const content: unknown[] = [createHero(), createStoryFlow()];

  videoScenes.forEach((scene, index) => {
    content.push(createSceneHeading(scene, index > 0));
    content.push(createSceneColumns(scene));
  });

  pdfMake
    .createPdf({
      info: {
        title: 'Nasution Boy Storyline',
        author: 'Nempo',
        subject: 'Shot list video feed IG dan TikTok',
      },
      pageSize: 'A4',
      pageMargins: [28, 28, 28, 28],
      defaultStyle: {
        font: 'Roboto',
        fontSize: 8,
        color: COLORS.body,
      },
      styles: {
        heroKicker: { fontSize: 7, bold: true, color: COLORS.paleGold, characterSpacing: 0.8 },
        heroTitle: { fontSize: 25, color: COLORS.white },
        heroEvent: { fontSize: 8, bold: true, color: '#f0d8b5', characterSpacing: 0.4 },
        heroIntro: { fontSize: 8, color: '#eee3d5', lineHeight: 1.25 },
        heroMetaLabel: { fontSize: 6, bold: true, color: '#d9c3a7', characterSpacing: 0.7 },
        heroMetaValue: { fontSize: 8, bold: true, color: COLORS.white },
        flowItem: { fontSize: 7, bold: true, color: COLORS.brownText },
        sceneNumber: { fontSize: 20, bold: true, color: COLORS.brown },
        sceneStage: { fontSize: 6, bold: true, color: COLORS.muted, characterSpacing: 0.4 },
        sceneKicker: { fontSize: 6, bold: true, color: COLORS.muted, characterSpacing: 0.8 },
        sceneTitle: { fontSize: 13, color: '#422f21', lineHeight: 1.15 },
        sectionLabel: { fontSize: 6, bold: true, color: '#8b6c48', characterSpacing: 0.5 },
        lightSectionLabel: { fontSize: 6, bold: true, color: COLORS.paleGold, characterSpacing: 0.5 },
        body: { fontSize: 7.5, color: COLORS.body, lineHeight: 1.2 },
        shotNumber: { fontSize: 6.5, bold: true, color: COLORS.brown },
        shotTitle: { fontSize: 7, bold: true, color: COLORS.brownText },
        shotBody: { fontSize: 7.2, color: COLORS.body, lineHeight: 1.15 },
        quoteSpeaker: { fontSize: 6, bold: true, color: COLORS.muted, characterSpacing: 0.4 },
        quote: { fontSize: 7.5, italics: true, color: '#44372a', lineHeight: 1.15 },
        detailHeading: { fontSize: 7.5, bold: true, color: '#5d432d' },
        lightQuote: { fontSize: 7.5, bold: true, color: COLORS.white, lineHeight: 1.2 },
        hashtag: { fontSize: 7, bold: true, color: COLORS.brownText },
      },
      content,
    })
    .download('Nasution-Boy-Storyline.pdf');
}
