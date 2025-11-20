/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract background image URL from style
  function getBackgroundImageUrl(panelImageDiv) {
    if (!panelImageDiv) return null;
    const style = panelImageDiv.getAttribute('style') || '';
    let match = style.match(/--imageDesktop:\s*url\(['"]?([^'")]+)['"]?\)/);
    if (!match) {
      match = style.match(/--imageMobile:\s*url\(['"]?([^'")]+)['"]?\)/);
    }
    return match ? match[1] : null;
  }

  // Find desktop panel
  const desktopPanel = element.querySelector('.narrow-hero__panel--desktop');
  const panelImageDiv = desktopPanel && desktopPanel.querySelector('.panel__image');
  const bgImageUrl = getBackgroundImageUrl(panelImageDiv);

  // Reference image element if background image exists
  let bgImageEl = null;
  if (bgImageUrl) {
    bgImageEl = document.createElement('img');
    bgImageEl.src = bgImageUrl;
    bgImageEl.loading = 'lazy';
    bgImageEl.alt = '';
  }

  // Extract all text content from both desktop and mobile panels
  let headlineText = '';
  // Try desktop panel first
  let headlineEl = desktopPanel && desktopPanel.querySelector('.panel__headline');
  if (!headlineEl) {
    // Fallback to mobile panel
    const mobilePanel = element.querySelector('.narrow-hero__panel--mobile');
    headlineEl = mobilePanel && mobilePanel.querySelector('.panel__headline');
  }
  if (headlineEl) {
    headlineText = headlineEl.textContent.trim();
  }

  // Compose content cell
  const contentCell = [];
  if (headlineText) {
    const h1 = document.createElement('h1');
    h1.textContent = headlineText;
    contentCell.push(h1);
  }

  // Table rows
  const headerRow = ['Hero (hero2)'];
  const imageRow = [bgImageEl ? bgImageEl : ''];
  const contentRow = [contentCell.length ? contentCell : ''];

  // Create table
  const cells = [headerRow, imageRow, contentRow];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(blockTable);
}
