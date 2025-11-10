/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image URL from panel__image style attribute
  function getImageUrl(panelImageDiv) {
    if (!panelImageDiv) return null;
    const style = panelImageDiv.getAttribute('style') || '';
    // Try to get --imageDesktop first
    const desktopMatch = style.match(/--imageDesktop:\s*url\(['"]?([^'")]+)['"]?\)/);
    if (desktopMatch && desktopMatch[1]) {
      return desktopMatch[1];
    }
    // Fallback: try --imageMobile
    const mobileMatch = style.match(/--imageMobile:\s*url\(['"]?([^'")]+)['"]?\)/);
    if (mobileMatch && mobileMatch[1]) {
      return mobileMatch[1];
    }
    return null;
  }

  // Find the desktop hero panel
  const desktopPanel = element.querySelector('.narrow-hero__panel--desktop');
  let imageUrl = null;
  let panelBody = null;
  if (desktopPanel) {
    const panelImageDiv = desktopPanel.querySelector('.panel__image');
    imageUrl = getImageUrl(panelImageDiv);
    panelBody = desktopPanel.querySelector('.panel__body');
  }
  // Fallback to mobile panel if desktop not found
  if ((!imageUrl || !panelBody) && element.querySelector('.narrow-hero__panel--mobile')) {
    const mobilePanel = element.querySelector('.narrow-hero__panel--mobile');
    if (!imageUrl) {
      const panelImageDiv = mobilePanel.querySelector('.panel__image');
      imageUrl = getImageUrl(panelImageDiv);
    }
    if (!panelBody) {
      panelBody = mobilePanel.querySelector('.panel__body');
    }
  }

  // Create image element if imageUrl exists
  let imageEl = null;
  if (imageUrl) {
    imageEl = document.createElement('img');
    imageEl.src = imageUrl;
    imageEl.setAttribute('loading', 'lazy');
  }

  // Extract all text content from panelBody (not just headline/kicker)
  let contentCell = [];
  if (panelBody) {
    // Collect all visible text nodes (e.g., headline, subheading, etc.)
    // Instead of targeting classes, get all direct children and their text
    Array.from(panelBody.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        contentCell.push(node.cloneNode(true));
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        // If there's significant text directly
        const span = document.createElement('span');
        span.textContent = node.textContent.trim();
        contentCell.push(span);
      }
    });
  }

  // If nothing found, ensure at least empty string for cell
  if (contentCell.length === 0) contentCell = [''];

  // Build the table rows
  const headerRow = ['Hero (hero2)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [contentCell];

  // Create the block table
  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
