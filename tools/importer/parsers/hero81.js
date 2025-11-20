/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Extract background image from inline style
  function extractBackgroundImage(panelImageDiv) {
    if (!panelImageDiv) return null;
    const style = panelImageDiv.getAttribute('style') || '';
    let urlMatch = style.match(/--imageDesktop:\s*url\(['"]?([^'")]+)['"]?\)/);
    if (!urlMatch) {
      urlMatch = style.match(/--imageMobile:\s*url\(['"]?([^'")]+)['"]?\)/);
    }
    return urlMatch ? urlMatch[1] : null;
  }

  // Find the desktop hero panel (prefer desktop for image)
  const desktopPanel = element.querySelector('.narrow-hero__panel--desktop');
  const panelImageDiv = desktopPanel && desktopPanel.querySelector('.panel__image');
  const bgImageUrl = extractBackgroundImage(panelImageDiv);

  // Create image element if image URL found
  let imageEl = null;
  if (bgImageUrl) {
    imageEl = document.createElement('img');
    imageEl.src = bgImageUrl;
    imageEl.alt = '';
  }

  // Extract headline (from either desktop or mobile panel)
  let headlineEl = null;
  const headlineDiv = element.querySelector('.panel__body .panel__headline');
  if (headlineDiv) {
    headlineEl = document.createElement('h1');
    headlineEl.textContent = headlineDiv.textContent.trim();
  }

  // Extract CTA bar text and button
  const ctaBar = element.querySelector('.module-sticky-cta-bar');
  let ctaTextEl = null;
  let ctaLinkEl = null;
  if (ctaBar) {
    const textDiv = ctaBar.querySelector('.module-sticky-cta-bar-text');
    if (textDiv) {
      ctaTextEl = document.createElement('p');
      ctaTextEl.textContent = textDiv.textContent.trim();
    }
    const btnDiv = ctaBar.querySelector('.module-sticky-cta-bar-btn a');
    if (btnDiv) {
      ctaLinkEl = btnDiv.cloneNode(true);
    }
  }

  // Compose content for 3rd row: headline, CTA bar text, CTA button
  const thirdRowContent = [];
  if (headlineEl) thirdRowContent.push(headlineEl);
  if (ctaTextEl) thirdRowContent.push(ctaTextEl);
  if (ctaLinkEl) thirdRowContent.push(ctaLinkEl);

  // Compose table rows: 1 column, 3 rows
  const headerRow = ['Hero (hero81)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [thirdRowContent];

  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
