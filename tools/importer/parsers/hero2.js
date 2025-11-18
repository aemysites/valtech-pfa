/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Extract background image URL from style attribute
  function extractBgUrl(styleStr) {
    if (!styleStr) return null;
    const desktopMatch = styleStr.match(/--imageDesktop:\s*url\(['"]?([^'")]+)['"]?\)/);
    if (desktopMatch) return desktopMatch[1];
    const mobileMatch = styleStr.match(/--imageMobile:\s*url\(['"]?([^'")]+)['"]?\)/);
    if (mobileMatch) return mobileMatch[1];
    return null;
  }

  // Find the desktop hero panel
  const desktopPanel = element.querySelector('.narrow-hero__panel--desktop');
  if (!desktopPanel) return;

  // Extract background image URL
  const imgDiv = desktopPanel.querySelector('.panel__image');
  let imgUrl = null;
  if (imgDiv && imgDiv.getAttribute('style')) {
    imgUrl = extractBgUrl(imgDiv.getAttribute('style'));
  }

  // Create image element if image URL found
  let imageEl = null;
  if (imgUrl) {
    imageEl = document.createElement('img');
    imageEl.src = imgUrl;
    imageEl.loading = 'lazy';
  }

  // Extract all text content from both desktop and mobile panels
  let headlineText = '';
  // Try desktop panel
  const desktopBody = desktopPanel.querySelector('.panel__body');
  if (desktopBody) {
    const headlineEl = desktopBody.querySelector('.panel__headline');
    if (headlineEl && headlineEl.textContent.trim()) {
      headlineText = headlineEl.textContent.trim();
    }
  }
  // If not found, try mobile panel
  if (!headlineText) {
    const mobilePanel = element.querySelector('.narrow-hero__panel--mobile');
    if (mobilePanel) {
      const mobileBody = mobilePanel.querySelector('.panel__body');
      if (mobileBody) {
        const headlineEl = mobileBody.querySelector('.panel__headline');
        if (headlineEl && headlineEl.textContent.trim()) {
          headlineText = headlineEl.textContent.trim();
        }
      }
    }
  }

  // Compose content row with headline as heading element
  let contentCell = '';
  if (headlineText) {
    const h1 = document.createElement('h1');
    h1.textContent = headlineText;
    contentCell = h1;
  }

  // Table rows
  const headerRow = ['Hero (hero2)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [contentCell ? contentCell : ''];

  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(block);
}
