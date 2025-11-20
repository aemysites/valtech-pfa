/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Extract background image URL from style attribute
  function extractBgImageUrl(style) {
    if (!style) return null;
    const match = style.match(/--imageDesktop:\s*url\(['"]?([^'")]+)['"]?\)/);
    return match ? match[1] : null;
  }

  // 1. HEADER ROW
  const headerRow = ['Hero (hero100)'];

  // 2. BACKGROUND IMAGE/VIDEO ROW
  let bgCellContent = [];
  const desktopHero = element.querySelector('.narrow-hero__panel--desktop');
  if (desktopHero) {
    const panelImage = desktopHero.querySelector('.panel__image');
    if (panelImage) {
      // Prefer video if present
      const video = panelImage.querySelector('video');
      if (video) {
        bgCellContent.push(video.cloneNode(true));
      }
      // Also add the background image (as an <img>) if present
      const bgUrl = extractBgImageUrl(panelImage.getAttribute('style'));
      if (bgUrl) {
        const img = document.createElement('img');
        img.src = bgUrl;
        img.alt = '';
        bgCellContent.push(img);
      }
    }
  }
  if (bgCellContent.length === 0) bgCellContent = [''];

  // 3. CONTENT ROW (headline + sticky CTA content)
  const contentCell = [];

  // Headline (prefer desktop, fallback to mobile)
  const headlineEl = element.querySelector('.narrow-hero__panel--desktop .panel__headline') ||
                     element.querySelector('.narrow-hero__panel--mobile .panel__headline');
  if (headlineEl) {
    contentCell.push(headlineEl.cloneNode(true));
  }

  // Sticky CTA (icon, text, button)
  const stickyCta = element.querySelector('.sticky-cta');
  if (stickyCta) {
    const ctaInner = stickyCta.querySelector('.sticky-cta__inner');
    if (ctaInner) {
      // Info icon
      const infoIcon = ctaInner.querySelector('.sticky-cta__inner__img');
      if (infoIcon) {
        contentCell.push(infoIcon.cloneNode(true));
      }
      // CTA text
      const textEl = ctaInner.querySelector('.sticky-cta__inner__text');
      if (textEl) {
        contentCell.push(textEl.cloneNode(true));
      }
      // CTA button
      const btnEl = ctaInner.querySelector('a.sticky-cta__inner__btn');
      if (btnEl) {
        contentCell.push(btnEl.cloneNode(true));
      }
      // Close icon (SVG)
      const closeIcon = ctaInner.querySelector('img[src^="data:image/svg+xml"]');
      if (closeIcon) {
        contentCell.push(closeIcon.cloneNode(true));
      }
    }
  }

  if (contentCell.length === 0) contentCell.push('');

  // Compose table rows
  const rows = [
    headerRow,
    [bgCellContent.length === 1 ? bgCellContent[0] : bgCellContent],
    [contentCell.length === 1 ? contentCell[0] : contentCell]
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
