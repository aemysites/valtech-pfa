/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards11) block: extract cards from a row of columns
  const headerRow = ['Cards (cards11)'];
  const rows = [headerRow];

  // Find all card columns (each card is a .col-xs-12.col-sm-4)
  const cardColumns = element.querySelectorAll('.col-xs-12.col-sm-4');

  cardColumns.forEach((col) => {
    // Get image (icon)
    const imgWrapper = col.querySelector('div'); // first div inside col
    const img = imgWrapper ? imgWrapper.querySelector('img') : null;

    // Get text (title)
    // The second div inside col contains the heading
    const textWrapper = col.querySelectorAll('div')[1];
    let title = null;
    if (textWrapper) {
      title = textWrapper.querySelector('h4');
    }

    // Build card row: [image, text]
    // Defensive: Only add if at least image and title exist
    if (img && title) {
      rows.push([
        img,
        title
      ]);
    }
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
