/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Table header row
  const headerRow = ['Hero (hero2)'];

  // 2. Background image row
  // Locate the image inside .panel__image
  const panelImage = element.querySelector('.panel__image img');
  let imageRow;
  if (panelImage) {
    imageRow = [panelImage];
  } else {
    imageRow = [''];
  }

  // 3. Content row (headline, subheading)
  // Locate the panel__body content
  const panelBody = element.querySelector('.panel__body');
  let contentRow;
  if (panelBody) {
    // We'll collect kicker, headline, and any CTA (none present here)
    const cells = [];
    // Subheading/kicker
    const kicker = panelBody.querySelector('.panel__kicker');
    if (kicker) cells.push(kicker);
    // Main headline
    const headline = panelBody.querySelector('.panel__headline');
    if (headline) cells.push(headline);
    // No CTA detected in this block
    contentRow = [cells];
  } else {
    contentRow = [''];
  }

  // Compose table rows
  const rows = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(table);
}
