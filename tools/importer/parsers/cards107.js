/* global WebImporter */
export default function parse(element, { document }) {
  // Find all card rows within the main container
  const cardRows = Array.from(element.querySelectorAll('.row.teasers > .col-sm-12 > .row'));

  // Table header row: block name and variant
  const headerRow = ['Cards (cards107)'];
  const rows = [headerRow];

  cardRows.forEach((row) => {
    // --- Image extraction ---
    // Find the image element in the left column
    const imgEl = row.querySelector('.col-sm-3 .teasers__teaser img');
    // Reference the actual image element (not clone)
    const imageCell = imgEl || '';

    // --- Text extraction ---
    const textCol = row.querySelector('.col-sm-9 .teasers__teaser');
    const textCellContent = [];
    if (textCol) {
      // Title (h4)
      const title = textCol.querySelector('h4');
      if (title) textCellContent.push(title);
      // All paragraphs (including links)
      textCol.querySelectorAll('p').forEach((p) => {
        textCellContent.push(p);
      });
    }

    // Add the card row to the table
    rows.push([
      imageCell,
      textCellContent
    ]);
  });

  // Create the table and replace the original element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
