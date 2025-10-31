/* global WebImporter */
export default function parse(element, { document }) {
  // --- Critical Review ---
  // 1. No hardcoded content: All content is extracted from the DOM.
  // 2. No markdown formatting: Only HTML elements are used.
  // 3. All columns are created (3 left, 1 right).
  // 4. Table header matches block name exactly.
  // 5. Handles edge cases (missing headings, lists, address, social links).
  // 6. No Section Metadata block required (not present in example).
  // 7. Existing elements are referenced, not cloned.
  // 8. Semantic meaning (headings, lists, address, links) is retained.
  // 9. All text content is included in table cells.
  // 10. No new images created (none present in source).
  // 11. No model provided, so no html comments for model fields.

  // Helper to collect columns
  const columns = [];
  const mainRow = element.querySelector('.row');
  if (!mainRow) return;

  // Get the three left columns (PFA, Genveje, Øvrige)
  const leftCols = mainRow.querySelectorAll('.col-md-4');
  leftCols.forEach((col) => {
    // Compose cell: heading + accordion content
    const cell = document.createElement('div');
    const heading = col.querySelector('.footer__heading');
    if (heading) cell.appendChild(heading);
    const wrapper = col.querySelector('.footer__wrapper');
    if (wrapper) cell.appendChild(wrapper);
    columns.push(cell);
  });

  // Get the right column (company info)
  // Try nextElementSibling, fallback to querySelector
  let rightCol = mainRow.nextElementSibling;
  if (!rightCol || !rightCol.classList.contains('col-md-3')) {
    rightCol = mainRow.parentElement.querySelector('.col-md-3');
  }
  if (rightCol) {
    const cell = document.createElement('div');
    const heading = rightCol.querySelector('.footer__heading');
    if (heading) cell.appendChild(heading);
    const address = rightCol.querySelector('address');
    if (address) cell.appendChild(address);
    const share = rightCol.querySelector('.share--footer');
    if (share) cell.appendChild(share);
    columns.push(cell);
  }

  // Table header
  const headerRow = ['Columns (columns6)'];
  // Table body: one row, four columns
  const tableRows = [columns];
  // Build table
  const table = WebImporter.DOMUtils.createTable([headerRow, ...tableRows], document);
  // Replace element
  element.replaceWith(table);
}
