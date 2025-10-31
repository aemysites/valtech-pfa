/* global WebImporter */
export default function parse(element, { document }) {
  // Critical review: Ensure all content is dynamically extracted, not hardcoded
  // Find the two main columns by their Bootstrap grid classes
  let leftCol = element.querySelector('.col-xs-12.col-sm-9');
  let rightCol = element.querySelector('.col-xs-12.col-sm-3');

  // Edge case: fallback if not found
  if (!leftCol || !rightCol) {
    const cols = element.querySelectorAll('.col-xs-12');
    if (cols.length === 2) {
      leftCol = cols[0];
      rightCol = cols[1];
    } else {
      // Fallback: try to find by col-sm-9 and col-sm-3 only
      leftCol = element.querySelector('.col-sm-9');
      rightCol = element.querySelector('.col-sm-3');
    }
  }

  // Final fallback: use first and second child if columns are still missing
  if (!leftCol || !rightCol) {
    const children = Array.from(element.children);
    leftCol = children[0] || document.createElement('div');
    rightCol = children[1] || document.createElement('div');
  }

  // Ensure all text and links are included, and reference existing elements
  // Table header must match block name exactly
  const headerRow = ['Columns (columns6)'];
  const contentRow = [leftCol, rightCol];

  // Use WebImporter.DOMUtils.createTable for table creation
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);

  // Replace the original element with the new block
  element.replaceWith(table);
}
