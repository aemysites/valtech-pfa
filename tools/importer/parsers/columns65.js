/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Extract desktop image URL from CSS variable
  function getImageUrlFromStyle(styleString, variable) {
    const regex = new RegExp(`${variable}: url\(['"]?([^'")]+)['"]?\)`);
    const match = styleString.match(regex);
    return match && match[1] ? match[1] : null;
  }

  // Find the desktop panel (with image)
  const desktopPanel = element.querySelector('.narrow-hero__panel--desktop');

  // Extract image from desktop panel
  let imageEl = null;
  if (desktopPanel) {
    const panelImageDiv = desktopPanel.querySelector('.panel__image');
    if (panelImageDiv && panelImageDiv.getAttribute('style')) {
      const styleString = panelImageDiv.getAttribute('style');
      // Extract the correct image URL from the style string
      // FIX: Use correct regex to get the image URL
      const imgUrlMatch = styleString.match(/--imageDesktop: url\(['"]?([^'")]+)['"]?\)/);
      const imgUrl = imgUrlMatch && imgUrlMatch[1] ? imgUrlMatch[1] : null;
      if (imgUrl && typeof imgUrl === 'string' && imgUrl.trim().length > 0) {
        imageEl = document.createElement('img');
        imageEl.src = imgUrl;
        imageEl.alt = '';
      }
    }
  }

  // Extract ALL text content from panel__body (not just kicker/headline)
  let textContentEls = [];
  let panelBody = null;
  if (desktopPanel) {
    panelBody = desktopPanel.querySelector('.panel__body');
  }
  if (panelBody) {
    Array.from(panelBody.childNodes).forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        textContentEls.push(node.cloneNode(true));
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        const span = document.createElement('span');
        span.textContent = node.textContent;
        textContentEls.push(span);
      }
    });
  }

  // Build table rows
  const headerRow = ['Columns (columns65)'];
  // Two columns: left (text), right (image)
  const contentRow = [textContentEls, imageEl ? [imageEl] : []];

  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
