/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content row (contains the columns)
  const container = element.querySelector('.container-fluid');
  if (!container) return;
  const teasersRow = container.querySelector('.row.teasers');
  if (!teasersRow) return;
  const columnsRow = teasersRow.querySelector('.row');
  if (!columnsRow) return;

  // Get the two columns
  const columns = Array.from(columnsRow.children);
  if (columns.length < 2) return;

  // LEFT COLUMN: Gather ALL text content (headings, paragraphs, links)
  const leftCol = columns[0];
  const leftContent = [];
  // Get visible heading
  const heading = leftCol.querySelector('h2:not([style*="display:none"])');
  if (heading) leftContent.push(heading);
  // Get all h5s (subheadings and descriptions)
  leftCol.querySelectorAll('h5').forEach(h5 => leftContent.push(h5));
  // Get all paragraphs (if any)
  leftCol.querySelectorAll('p').forEach(p => leftContent.push(p));
  // Get links (ul.panel__links)
  const linksList = leftCol.querySelector('ul.panel__links');
  if (linksList) {
    // Preserve the list structure
    leftContent.push(linksList.cloneNode(true));
  }

  // RIGHT COLUMN: Include ALL images (SVG icon)
  const rightCol = columns[1];
  const rightContent = [];
  rightCol.querySelectorAll('img').forEach(img => rightContent.push(img));

  // Table header must match block name exactly
  const headerRow = ['Columns (columns53)'];
  // Table row: left column, right column
  const tableRows = [headerRow, [leftContent, rightContent]];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(table);
}
