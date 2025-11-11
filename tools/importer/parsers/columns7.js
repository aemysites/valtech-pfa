/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns7)'];

  // Get immediate children divs (the two columns)
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  let leftCol, rightCol;
  if (columns.length === 2) {
    if (columns[0].classList.contains('col-sm-8')) {
      leftCol = columns[0];
      rightCol = columns[1];
    } else {
      leftCol = columns[1];
      rightCol = columns[0];
    }
  } else {
    leftCol = element;
    rightCol = document.createElement('div');
  }

  // Left column: gather all non-empty paragraphs and CTA, preserving structure
  const leftContent = [];
  leftCol.querySelectorAll('p').forEach(p => {
    // Only add non-empty paragraphs (ignore empty <p> tags)
    if (p.textContent.trim() || p.querySelector('a, button')) {
      leftContent.push(p);
    }
  });

  // Right column: find image (should be only one)
  const rightContent = [];
  const img = rightCol.querySelector('img');
  if (img) {
    rightContent.push(img);
  }

  // Build the table rows
  const contentRow = [leftContent, rightContent];
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
