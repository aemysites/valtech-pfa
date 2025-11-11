/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get immediate child divs
  const topDivs = Array.from(element.querySelectorAll(':scope > div'));

  // Defensive: find the main content area
  let mainRow = null;
  for (const div of topDivs) {
    // Look for a div with class 'container-fluid' or 'row teasers'
    if (div.classList.contains('container-fluid')) {
      mainRow = div.querySelector('.row.teasers');
      break;
    }
    if (div.classList.contains('row') && div.classList.contains('teasers')) {
      mainRow = div;
      break;
    }
  }
  if (!mainRow) return;

  // Find the content columns inside the teasers row
  const colDivs = Array.from(mainRow.querySelectorAll(':scope > .col-sm-12 > .row > div'));
  // Defensive: fallback if structure is different
  if (!colDivs.length) {
    // Try to find direct columns
    const fallbackCols = Array.from(mainRow.querySelectorAll(':scope > .row > div'));
    if (fallbackCols.length) {
      colDivs.push(...fallbackCols);
    }
  }
  if (colDivs.length < 2) return;

  // Left column: text content (heading, paragraph, CTA)
  const leftCol = colDivs[0];
  // Find teaser content
  let teaserContent = leftCol.querySelector('.teasers__teaser');
  if (!teaserContent) teaserContent = leftCol;

  // Right column: image content
  const rightCol = colDivs[1];
  const img = rightCol.querySelector('img');

  // Compose left cell: heading, paragraph(s), CTA
  // Defensive: get all children except empty paragraphs
  const leftCellContent = [];
  Array.from(teaserContent.children).forEach((child) => {
    // Exclude empty paragraphs
    if (child.tagName === 'P' && child.textContent.trim() === '\u00A0') return;
    leftCellContent.push(child);
  });

  // Compose right cell: image only (if exists)
  const rightCellContent = img ? [img] : [];

  // Table structure
  const headerRow = ['Columns (columns29)'];
  const contentRow = [leftCellContent, rightCellContent];

  // Create block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace original element
  element.replaceWith(table);
}
