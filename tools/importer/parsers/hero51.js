/* global WebImporter */
export default function parse(element, { document }) {
  // --- 1. Header row ---
  const headerRow = ['Hero (hero51)'];

  // --- 2. Image row ---
  let imageEl = null;
  // Prefer desktop panel for image
  const desktopPanel = element.querySelector('.narrow-hero__panel--desktop');
  const mobilePanel = element.querySelector('.narrow-hero__panel--mobile');
  const panel = desktopPanel || mobilePanel;
  if (panel) {
    const panelImageDiv = panel.querySelector('.panel__image');
    if (panelImageDiv) {
      // Extract background image URL from CSS variable
      const style = panelImageDiv.getAttribute('style') || '';
      const match = style.match(/--imageDesktop:\s*url\(['"]?([^'")]+)['"]?\)/);
      if (match && match[1]) {
        imageEl = document.createElement('img');
        imageEl.src = match[1];
        imageEl.alt = '';
      }
    }
  }
  const imageRow = [imageEl ? imageEl : ''];

  // --- 3. Content row ---
  // Only use the desktop panel's body for hero content (no duplication)
  let contentEls = [];
  let contentPanel = desktopPanel || mobilePanel;
  if (contentPanel) {
    const body = contentPanel.querySelector('.panel__body');
    if (body) {
      // Subheading (kicker)
      const kicker = body.querySelector('.panel__kicker');
      if (kicker) contentEls.push(kicker.cloneNode(true));
      // Main heading
      const headline = body.querySelector('.panel__headline');
      if (headline) contentEls.push(headline.cloneNode(true));
      // CTA (call-to-action)
      const cta = body.querySelector('.cta-btn');
      if (cta) {
        // Find the closest parent <a> for the link
        let parentA = contentPanel.closest('a');
        let linkHref = parentA && parentA.href ? parentA.href : null;
        if (linkHref) {
          const ctaLink = document.createElement('a');
          ctaLink.href = linkHref;
          ctaLink.innerHTML = cta.innerHTML;
          contentEls.push(ctaLink);
        } else {
          contentEls.push(cta.cloneNode(true));
        }
      }
    }
  }
  const contentRow = [contentEls.length ? contentEls : ''];

  // --- Compose table ---
  const cells = [
    headerRow,
    imageRow,
    contentRow
  ];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
