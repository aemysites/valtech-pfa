/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get background image URL from style attribute
  function getBackgroundImageUrl(panelImageDiv) {
    if (!panelImageDiv) return null;
    const style = panelImageDiv.getAttribute('style') || '';
    // Try desktop image first
    const desktopMatch = style.match(/--imageDesktop: url\(['"]?([^'")]+)['"]?\)/);
    if (desktopMatch) return desktopMatch[1];
    // Fallback to mobile image
    const mobileMatch = style.match(/--imageMobile: url\(['"]?([^'")]+)['"]?\)/);
    if (mobileMatch) return mobileMatch[1];
    return null;
  }

  // Find the desktop hero panel
  const desktopPanel = element.querySelector('.narrow-hero__panel--desktop');
  // Fallback to mobile panel if desktop not found
  const panel = desktopPanel || element.querySelector('.narrow-hero__panel--mobile');

  // Get background image URL
  let bgImageUrl = null;
  let panelImageDiv = null;
  if (panel) {
    panelImageDiv = panel.querySelector('.panel__image');
    bgImageUrl = getBackgroundImageUrl(panelImageDiv);
  } else {
    // Try to find .panel__image anywhere in the element
    panelImageDiv = element.querySelector('.panel__image');
    bgImageUrl = getBackgroundImageUrl(panelImageDiv);
  }

  // Create image element if background image exists
  let imageEl = null;
  if (bgImageUrl) {
    imageEl = document.createElement('img');
    imageEl.src = bgImageUrl;
    imageEl.alt = '';
  }

  // Find all possible panel bodies (desktop and mobile)
  const panelBodies = Array.from(element.querySelectorAll('.panel__body'));
  // Collect all headline text from all panel bodies
  let headlineText = '';
  for (const body of panelBodies) {
    const headline = body.querySelector('.panel__headline');
    if (headline && headline.textContent.trim()) {
      headlineText = headline.textContent.trim();
      break; // Prefer first found
    }
  }

  // Compose table rows
  const headerRow = ['Hero (hero2)'];
  const imageRow = [imageEl ? imageEl : ''];

  // For content row, create a heading element if headline text exists
  let contentCell = '';
  if (headlineText) {
    const heading = document.createElement('h1');
    heading.textContent = headlineText;
    contentCell = heading;
  }

  const contentRow = [contentCell ? contentCell : ''];

  // Build the block table
  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
