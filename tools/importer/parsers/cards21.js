/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards21) block: 2 columns, multiple rows
  // Header row
  const headerRow = ['Cards (cards21)'];
  const rows = [headerRow];

  // Find all card columns (be flexible: match col-xs-12 and col-md-3)
  const cardCols = element.querySelectorAll('.col-xs-12.col-sm-6.col-md-3');

  cardCols.forEach((col) => {
    // Each card
    const teaser = col.querySelector('.teasers__teaser');
    if (!teaser) return;

    // --- Image/Icon cell ---
    const img = teaser.querySelector('img');
    const imageCell = img || '';

    // --- Text cell ---
    // Title (h3)
    const title = teaser.querySelector('h3');
    // All paragraphs (including those with toggler/accordion content)
    const paragraphs = Array.from(teaser.querySelectorAll('p'));
    const textCellContent = [];
    if (title) textCellContent.push(title);
    paragraphs.forEach((p) => {
      // Clone paragraph so we can preserve all text, including toggler/accordion
      const pClone = p.cloneNode(true);
      textCellContent.push(pClone);
    });

    rows.push([imageCell, textCellContent]);
  });

  // Create and replace block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
