/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background image URL from style attribute
  function getPanelImageUrl(panelImageDiv) {
    if (!panelImageDiv) return null;
    const style = panelImageDiv.getAttribute('style') || '';
    const desktopMatch = style.match(/--imageDesktop:\s*url\(['"]?([^'")]+)['"]?\)/);
    const mobileMatch = style.match(/--imageMobile:\s*url\(['"]?([^'")]+)['"]?\)/);
    return desktopMatch ? desktopMatch[1] : (mobileMatch ? mobileMatch[1] : null);
  }

  // Find the hero panel (desktop preferred)
  const heroPanel = element.querySelector('.narrow-hero__panel--desktop') || element.querySelector('.narrow-hero__panel--mobile');
  let imageUrl = null;
  if (heroPanel) {
    const panelImageDiv = heroPanel.querySelector('.panel__image');
    imageUrl = getPanelImageUrl(panelImageDiv);
  }

  let imageEl = null;
  if (imageUrl) {
    imageEl = document.createElement('img');
    imageEl.src = imageUrl;
    imageEl.alt = '';
  }

  // Extract headline from hero panel
  let headlineText = '';
  if (heroPanel) {
    const headlineEl = heroPanel.querySelector('.panel__headline');
    if (headlineEl) {
      headlineText = headlineEl.textContent.trim();
    }
  }

  // Extract sticky CTA bar text content
  let ctaText = '';
  const stickyCta = element.querySelector('.sticky-cta');
  if (stickyCta) {
    const ctaTextDiv = stickyCta.querySelector('.sticky-cta__inner__text');
    if (ctaTextDiv) {
      const h4 = ctaTextDiv.querySelector('h4');
      if (h4) {
        ctaText = h4.textContent.trim();
      } else {
        ctaText = ctaTextDiv.textContent.trim();
      }
    }
  }

  // Compose content for row 3: headline and CTA text
  const contentRow = [];
  if (headlineText) {
    const h1 = document.createElement('h1');
    h1.textContent = headlineText;
    contentRow.push(h1);
  }
  if (ctaText) {
    const p = document.createElement('p');
    p.textContent = ctaText;
    contentRow.push(p);
  }

  // Table rows
  const headerRow = ['Hero (hero40)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRowFinal = [contentRow];

  // Create table
  const cells = [headerRow, imageRow, contentRowFinal];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(block);
}
