/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row for Hero (hero11)
  const headerRow = ['Hero (hero11)'];

  // Defensive: Find the image (background)
  let imgEl = null;
  const panelImage = element.querySelector('.panel__image img');
  if (panelImage) {
    imgEl = panelImage;
  }

  // Defensive: Find the headline (h1)
  let headlineEl = null;
  const panelHeadline = element.querySelector('.panel__body .panel__headline');
  if (panelHeadline) {
    headlineEl = panelHeadline;
  }

  // Row 2: Background image (optional)
  const imageRow = [imgEl ? imgEl : ''];

  // Row 3: Headline (optional)
  // Only headline is present in this example
  const contentRow = [headlineEl ? headlineEl : ''];

  // Compose table rows
  const rows = [
    headerRow,
    imageRow,
    contentRow
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
