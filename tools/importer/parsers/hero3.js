/* global WebImporter */
export default function parse(element, { document }) {
  // Find the hero panel
  const heroPanel = element.querySelector('.panel--hero');
  if (!heroPanel) return;

  // --- IMAGE ---
  // Find the image element inside the hero panel
  const imageContainer = heroPanel.querySelector('.panel__image');
  let imageEl = null;
  if (imageContainer) {
    // Use the actual <img> element reference
    imageEl = imageContainer.querySelector('img');
  }

  // --- HEADLINE ---
  // Find the headline element (h1-h6)
  const bodyContainer = heroPanel.querySelector('.panel__body');
  let headlineEl = null;
  if (bodyContainer) {
    headlineEl = bodyContainer.querySelector('h1, h2, h3, h4, h5, h6');
  }

  // --- TABLE CONSTRUCTION ---
  // Always use the required header row
  const headerRow = ['Hero (hero3)'];
  // Second row: image (reference the element, not alt or src)
  const imageRow = [imageEl ? imageEl : ''];
  // Third row: headline (reference the element, not text)
  const contentRow = [headlineEl ? headlineEl : ''];

  // Create the table block
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow
  ], document);

  // Replace the original element with the block
  element.replaceWith(table);
}
