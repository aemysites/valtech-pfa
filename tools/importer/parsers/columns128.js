/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two main rows
  const rows = Array.from(element.querySelectorAll('.row'));

  // --- First row ---
  // Left: heading, paragraph, list (should include all text content, not just one paragraph)
  let leftCol = [];
  if (rows[0]) {
    const left = rows[0].querySelector('.col-xs-12.col-sm-10');
    if (left) {
      // Include all descendants (not just direct children) and their text
      leftCol.push(...Array.from(left.querySelectorAll('h2, p, ul')));
    }
  }
  // Right: icon image
  let rightCol = [];
  if (rows[0]) {
    const right = rows[0].querySelector('.col-xs-12.col-sm-2');
    if (right) {
      // Include all images and any visible text
      rightCol.push(...Array.from(right.querySelectorAll('img')));
    }
  }

  // --- Second row ---
  // Left: blockquote (include all text and attribution)
  let blockquoteCol = [];
  if (rows[1]) {
    const left = rows[1].querySelector('.col-xs-12.col-sm-8');
    if (left) {
      // Include blockquote and all its descendants
      blockquoteCol.push(...Array.from(left.querySelectorAll('blockquote')));
    }
  }
  // Right: portrait image (include all images)
  let portraitCol = [];
  if (rows[1]) {
    const right = rows[1].querySelector('.col-xs-12.col-sm-4');
    if (right) {
      portraitCol.push(...Array.from(right.querySelectorAll('img')));
    }
  }

  // Only push non-empty rows
  const headerRow = ['Columns (columns128)'];
  const cells = [headerRow];
  if (leftCol.length > 0 || rightCol.length > 0) {
    cells.push([leftCol, rightCol]);
  }
  if (blockquoteCol.length > 0 || portraitCol.length > 0) {
    cells.push([blockquoteCol, portraitCol]);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
