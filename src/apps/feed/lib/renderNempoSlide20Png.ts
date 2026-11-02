import { toCanvas } from 'html-to-image';

type RenderOptions = {
  width: number;
  height: number;
  pixelRatio: number;
};

function splitCssLayers(value: string) {
  const layers: string[] = [];
  let depth = 0;
  let start = 0;

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    if (character === '(') depth += 1;
    if (character === ')') depth = Math.max(0, depth - 1);

    if (character === ',' && depth === 0) {
      layers.push(value.slice(start, index).trim());
      start = index + 1;
    }
  }

  layers.push(value.slice(start).trim());
  return layers;
}

function positionFraction(token: string | undefined) {
  if (!token || token === 'center') return 0.5;
  if (token === 'left' || token === 'top') return 0;
  if (token === 'right' || token === 'bottom') return 1;

  if (token.endsWith('%')) {
    const value = Number.parseFloat(token);
    return Number.isFinite(value) ? value / 100 : 0.5;
  }

  return 0.5;
}

function positionPair(value: string) {
  const [x, y] = value.trim().split(/\s+/);
  return {
    x: positionFraction(x),
    y: positionFraction(y),
  };
}

function lastBackgroundUrl(backgroundImage: string) {
  const matches =
    backgroundImage.match(/url\((?:"[^"]+"|'[^']+'|[^)]*)\)/g) ?? [];
  const match = matches[matches.length - 1];
  const rawUrl = match
    ?.slice(4, -1)
    .trim()
    .replace(/^["']|["']$/g, '');
  return rawUrl ? new URL(rawUrl, document.baseURI).href : null;
}

async function loadImage(source: string) {
  const image = new Image();
  image.crossOrigin = 'anonymous';
  image.src = source;
  await image.decode();

  if (!image.naturalWidth || !image.naturalHeight) {
    throw new Error(`Gagal memuat gambar ekspor: ${source}`);
  }

  return image;
}

function drawCoverImage(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
  position: { x: number; y: number },
) {
  const scale = Math.max(
    width / image.naturalWidth,
    height / image.naturalHeight,
  );
  const drawnWidth = image.naturalWidth * scale;
  const drawnHeight = image.naturalHeight * scale;
  const x = (width - drawnWidth) * position.x;
  const y = (height - drawnHeight) * position.y;

  context.drawImage(image, x, y, drawnWidth, drawnHeight);
}

function drawDomImage(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  box: { x: number; y: number; width: number; height: number },
) {
  const style = window.getComputedStyle(image);
  const objectPosition = positionPair(style.objectPosition);
  const fit = style.objectFit;
  const containScale = Math.min(
    box.width / image.naturalWidth,
    box.height / image.naturalHeight,
  );
  const coverScale = Math.max(
    box.width / image.naturalWidth,
    box.height / image.naturalHeight,
  );

  context.save();
  context.globalAlpha = Number.parseFloat(style.opacity) || 1;
  try {
    if (style.filter !== 'none') context.filter = style.filter;
  } catch {
    context.filter = 'none';
  }

  if (fit === 'contain' || fit === 'scale-down') {
    const scale =
      fit === 'scale-down' ? Math.min(1, containScale) : containScale;
    const width = image.naturalWidth * scale;
    const height = image.naturalHeight * scale;
    context.drawImage(
      image,
      box.x + (box.width - width) * objectPosition.x,
      box.y + (box.height - height) * objectPosition.y,
      width,
      height,
    );
  } else if (fit === 'cover') {
    const width = image.naturalWidth * coverScale;
    const height = image.naturalHeight * coverScale;
    context.beginPath();
    context.rect(box.x, box.y, box.width, box.height);
    context.clip();
    context.drawImage(
      image,
      box.x + (box.width - width) * objectPosition.x,
      box.y + (box.height - height) * objectPosition.y,
      width,
      height,
    );
  } else {
    context.drawImage(image, box.x, box.y, box.width, box.height);
  }

  context.restore();
}

export async function renderNempoSlide20Png(
  artwork: HTMLElement,
  options: RenderOptions,
) {
  const artworkBounds = artwork.getBoundingClientRect();
  if (!artworkBounds.width || !artworkBounds.height) {
    throw new Error('Ukuran slide 20 belum siap untuk diekspor.');
  }

  const originalStyle = window.getComputedStyle(artwork);
  const backgroundUrl = lastBackgroundUrl(originalStyle.backgroundImage);
  if (!backgroundUrl) {
    throw new Error('Gambar latar slide 20 tidak ditemukan.');
  }

  const background = await loadImage(backgroundUrl);
  const backgroundPositionLayers = splitCssLayers(
    originalStyle.backgroundPosition,
  );
  const backgroundPosition = positionPair(
    backgroundPositionLayers[backgroundPositionLayers.length - 1] ??
      'left center',
  );

  const offscreen = document.createElement('div');
  offscreen.setAttribute('aria-hidden', 'true');
  Object.assign(offscreen.style, {
    position: 'fixed',
    left: '-10000px',
    top: '0',
    width: `${artworkBounds.width}px`,
    height: `${artworkBounds.height}px`,
    overflow: 'hidden',
    pointerEvents: 'none',
    zIndex: '-1',
  });

  const layout = artwork.cloneNode(true) as HTMLElement;
  Object.assign(layout.style, {
    width: `${artworkBounds.width}px`,
    height: `${artworkBounds.height}px`,
    maxWidth: 'none',
    maxHeight: 'none',
    boxShadow: 'none',
  });
  layout.style.setProperty('background', 'transparent', 'important');
  layout.style.setProperty('background-image', 'none', 'important');
  layout.style.setProperty('background-color', 'transparent', 'important');
  layout.querySelectorAll('img').forEach((image) => {
    (image as HTMLImageElement).style.setProperty(
      'visibility',
      'hidden',
      'important',
    );
  });

  offscreen.appendChild(layout);
  document.body.appendChild(offscreen);

  let layoutCanvas: HTMLCanvasElement;
  try {
    layoutCanvas = await toCanvas(layout, {
      cacheBust: true,
      pixelRatio: options.pixelRatio,
      canvasWidth: options.width,
      canvasHeight: options.height,
      backgroundColor: 'transparent',
      style: {
        boxShadow: 'none',
        background: 'transparent',
        backgroundImage: 'none',
        backgroundColor: 'transparent',
      },
    });
  } finally {
    offscreen.remove();
  }

  const canvas = document.createElement('canvas');
  canvas.width = layoutCanvas.width;
  canvas.height = layoutCanvas.height;
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Tidak dapat menyiapkan canvas PNG slide 20.');
  }
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.fillStyle = '#201311';
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawCoverImage(
    context,
    background,
    canvas.width,
    canvas.height,
    backgroundPosition,
  );

  const horizontalShade = context.createLinearGradient(0, 0, canvas.width, 0);
  horizontalShade.addColorStop(0, 'rgba(32, 19, 17, 0.2)');
  horizontalShade.addColorStop(0.45, 'rgba(32, 19, 17, 0)');
  context.fillStyle = horizontalShade;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const verticalShade = context.createLinearGradient(0, 0, 0, canvas.height);
  verticalShade.addColorStop(0, 'rgba(32, 19, 17, 0.48)');
  verticalShade.addColorStop(0.42, 'rgba(32, 19, 17, 0.25)');
  verticalShade.addColorStop(1, 'rgba(32, 19, 17, 0.42)');
  context.fillStyle = verticalShade;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(layoutCanvas, 0, 0, canvas.width, canvas.height);

  const scaleX = canvas.width / artworkBounds.width;
  const scaleY = canvas.height / artworkBounds.height;
  const images = Array.from(artwork.querySelectorAll('img'));
  const illustrationImages = images.filter((image) =>
    image.classList.contains('sangkuriang-art'),
  );
  const overlayImages = images.filter(
    (image) => !image.classList.contains('sangkuriang-art'),
  );

  const drawImages = (imageElements: HTMLImageElement[]) => {
    imageElements.forEach((imageElement) => {
      if (!imageElement.complete || !imageElement.naturalWidth) {
        throw new Error(
          `Gambar slide 20 belum siap: ${imageElement.alt || imageElement.src}`,
        );
      }

      const bounds = imageElement.getBoundingClientRect();
      drawDomImage(context, imageElement, {
        x: (bounds.left - artworkBounds.left) * scaleX,
        y: (bounds.top - artworkBounds.top) * scaleY,
        width: bounds.width * scaleX,
        height: bounds.height * scaleY,
      });
    });
  };

  drawImages(illustrationImages);
  context.drawImage(layoutCanvas, 0, 0, canvas.width, canvas.height);
  drawImages(overlayImages);

  return canvas;
}
