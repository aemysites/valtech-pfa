/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two column containers
  const columns = Array.from(element.querySelectorAll(':scope > div.row > div'));
  if (columns.length === 0) {
    columns.push(...element.querySelectorAll(':scope > div.col-xs-12.col-sm-6'));
  }

  // For each column, get all teasers
  function getTeaserBlocks(colElem) {
    return Array.from(colElem.querySelectorAll(':scope > .teasers__teaser'));
  }

  const leftTeasers = getTeaserBlocks(columns[0] || document.createElement('div'));
  const rightTeasers = getTeaserBlocks(columns[1] || document.createElement('div'));

  // Only use the minimum length so no empty columns are created
  const minRows = Math.min(leftTeasers.length, rightTeasers.length);

  const headerRow = ['Columns (columns8)'];
  const rows = [];
  for (let i = 0; i < minRows; i++) {
    const leftCell = leftTeasers[i].cloneNode(true);
    const rightCell = rightTeasers[i].cloneNode(true);
    rows.push([leftCell, rightCell]);
  }

  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
