/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two columns
  const columns = Array.from(element.querySelectorAll(':scope > div.row > div'));
  const cols = columns.length === 2 ? columns : Array.from(element.querySelectorAll(':scope > div'));

  // Helper to extract all teasers (accordion groups) from a column
  function extractTeasers(col) {
    return Array.from(col.querySelectorAll('.teasers__teaser'));
  }

  // For each column, extract its teasers
  const leftTeasers = extractTeasers(cols[0] || document.createElement('div'));
  const rightTeasers = extractTeasers(cols[1] || document.createElement('div'));

  // Compose each column's cell as a vertical stack of teaser elements (including all content)
  function makeColumnCell(teasers) {
    const div = document.createElement('div');
    teasers.forEach((teaser) => {
      div.appendChild(teaser.cloneNode(true));
    });
    return div;
  }

  const headerRow = ['Columns (columns10)'];
  const row = [makeColumnCell(leftTeasers), makeColumnCell(rightTeasers)];

  const cells = [headerRow, row];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(table);
}
