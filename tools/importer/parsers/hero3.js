/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row with block name (required)
  const headerRow = ['Hero (hero3)'];

  // 2. Extract the background image (from <img> inside .panel__image)
  let imageEl = null;
  const imageContainer = element.querySelector('.panel__image img');
  if (imageContainer) {
    imageEl = imageContainer;
  }

  // 3. Extract the headline (from <h1> inside .panel__body)
  let headline = null;
  const headlineEl = element.querySelector('.panel__body h1');
  if (headlineEl) {
    headline = headlineEl;
  }

  // 4. Build table rows
  const rows = [
    headerRow,
    [imageEl ? imageEl : ''],
    [headline ? headline : ''],
  ];

  // 5. Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // 6. Replace the original element
  element.replaceWith(table);
}
