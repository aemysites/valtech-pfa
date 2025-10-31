/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: always the block name
  const headerRow = ['Hero (hero2)'];

  // 2. Image row: find the hero image (background or <img>)
  // The image is inside .panel__image > img
  let imageRowContent = '';
  const panelImage = element.querySelector('.panel__image img');
  if (panelImage) {
    imageRowContent = panelImage;
  }

  // 3. Content row: headline, kicker, and any CTA
  // Headline: .panel__headline
  // Kicker/subheading: .panel__kicker
  // No CTA in this example
  const panelBody = element.querySelector('.panel__body');
  let contentRowContent = [];
  if (panelBody) {
    // Kicker
    const kicker = panelBody.querySelector('.panel__kicker');
    if (kicker) contentRowContent.push(kicker);
    // Headline
    const headline = panelBody.querySelector('.panel__headline');
    if (headline) contentRowContent.push(headline);
  }

  // Compose the table rows
  const rows = [
    headerRow,
    [imageRowContent],
    [contentRowContent]
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
