/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Only proceed if the element is a UL with the expected class
  if (!element || !element.matches('ul.panel__links')) return;

  // Get all direct LI children (each contains a link)
  const items = Array.from(element.children).filter(el => el.tagName === 'LI');

  // Extract the anchor elements from each LI
  const links = items.map(li => {
    // Defensive: Only use the first anchor in each LI
    const a = li.querySelector('a');
    return a ? a : document.createTextNode('');
  });

  // Screenshot shows a 2x2 grid (2 columns, 2 rows)
  // Arrange links into rows and columns
  const columns = 2;
  const rows = Math.ceil(links.length / columns);
  const contentRows = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < columns; c++) {
      const idx = r * columns + c;
      row.push(links[idx] || '');
    }
    contentRows.push(row);
  }

  // Table header row
  const headerRow = ['Columns (columns16)'];

  // Compose table data
  const cells = [headerRow, ...contentRows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
