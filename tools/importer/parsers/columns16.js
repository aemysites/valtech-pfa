/* global WebImporter */
export default function parse(element, { document }) {
  // Columns (columns16) block header row
  const headerRow = ['Columns (columns16)'];

  // Find the <a> inside the ul.panel__links > li
  let columns = [];
  const ul = element.querySelector('ul.panel__links');
  if (ul) {
    const li = ul.querySelector('li');
    if (li) {
      const a = li.querySelector('a');
      if (a) {
        // Use the anchor element itself for the cell
        columns.push(a);
      }
    }
  } else {
    // Fallback: treat the whole element's text as one column
    columns = [element.textContent.trim()];
  }

  // Build the table rows: header row, then one row with columns
  const rows = [headerRow, columns];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
