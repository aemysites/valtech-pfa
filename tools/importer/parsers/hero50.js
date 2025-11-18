/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Extract background image URL from panel__image style
  function getBackgroundImageUrl(panelImageDiv) {
    if (!panelImageDiv) return null;
    const style = panelImageDiv.getAttribute('style') || '';
    // Try --imageDesktop first, fallback to --imageMobile
    const match = style.match(/--imageDesktop:\s*url\(['"]?([^'")]+)['"]?\)/);
    if (match && match[1]) return match[1];
    const matchMobile = style.match(/--imageMobile:\s*url\(['"]?([^'")]+)['"]?\)/);
    if (matchMobile && matchMobile[1]) return matchMobile[1];
    return null;
  }

  // 1. Header row
  const headerRow = ['Hero (hero50)'];

  // 2. Background image row
  let imageRow = [''];
  // Find desktop hero panel
  const desktopPanel = element.querySelector('.narrow-hero__panel--desktop');
  let bgUrl = null;
  if (desktopPanel) {
    const panelImageDiv = desktopPanel.querySelector('.panel__image');
    bgUrl = getBackgroundImageUrl(panelImageDiv);
    if (bgUrl) {
      // Create image element
      const img = document.createElement('img');
      img.src = bgUrl;
      img.alt = '';
      imageRow = [img];
    }
  }

  // 3. Content row
  // Include ALL text content: sticky bar text/button + hero overlay kicker/headline
  const contentCell = [];

  // Sticky bar text and CTA button
  const stickyBar = element.querySelector('.module-sticky-cta-bar');
  if (stickyBar) {
    const stickyTextDiv = stickyBar.querySelector('.module-sticky-cta-bar-text');
    if (stickyTextDiv) {
      const stickyTextElem = document.createElement('div');
      stickyTextElem.textContent = stickyTextDiv.textContent.trim();
      contentCell.push(stickyTextElem);
    }
    const ctaBtnDiv = stickyBar.querySelector('.module-sticky-cta-bar-btn');
    if (ctaBtnDiv) {
      const ctaLink = ctaBtnDiv.querySelector('a');
      if (ctaLink) {
        contentCell.push(ctaLink.cloneNode(true));
      }
    }
  }

  // Hero overlay text: kicker and headline
  let panelBody = null;
  if (desktopPanel) {
    panelBody = desktopPanel.querySelector('.panel__body');
  }
  if (!panelBody) {
    // fallback to mobile panel
    const mobilePanel = element.querySelector('.narrow-hero__panel--mobile');
    if (mobilePanel) {
      panelBody = mobilePanel.querySelector('.panel__body');
    }
  }
  if (panelBody) {
    const kicker = panelBody.querySelector('.panel__kicker');
    if (kicker) {
      contentCell.push(kicker.cloneNode(true));
    }
    const headline = panelBody.querySelector('.panel__headline');
    if (headline) {
      contentCell.push(headline.cloneNode(true));
    }
  }

  // Compose content row
  const contentRow = [contentCell];

  // Build table
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
