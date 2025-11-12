/* global WebImporter */
export default function parse(element, { document }) {
  // Find the inner row with columns
  const innerRow = element.querySelector('.row.teasers > .row');
  let leftCol = null, rightCol = null;
  if (innerRow) {
    leftCol = innerRow.querySelector('.col-xs-12.col-sm-8');
    rightCol = innerRow.querySelector('.col-xs-12.col-sm-4');
  }

  // Extract left column: get ONLY visible heading and paragraphs as elements
  let leftContent = [];
  if (leftCol) {
    // Get visible heading (not hidden)
    const headings = leftCol.querySelectorAll('h2');
    headings.forEach(h => {
      if (window.getComputedStyle(h).display !== 'none') {
        leftContent.push(h.cloneNode(true));
      }
    });
    // Get all paragraphs
    leftCol.querySelectorAll('p').forEach(p => {
      leftContent.push(p.cloneNode(true));
    });
  }

  // Extract right column: get all images as elements
  let rightContent = [];
  if (rightCol) {
    rightCol.querySelectorAll('img').forEach(img => {
      rightContent.push(img.cloneNode(true));
    });
  }

  // Fallback: If leftCol is missing, get visible heading and paragraphs from anywhere except hidden ones
  if (leftContent.length === 0) {
    element.querySelectorAll('h2').forEach(h => {
      if (window.getComputedStyle(h).display !== 'none') {
        leftContent.push(h.cloneNode(true));
      }
    });
    element.querySelectorAll('p').forEach(p => {
      leftContent.push(p.cloneNode(true));
    });
  }
  // If rightCol is missing, get images from anywhere
  if (rightContent.length === 0) {
    element.querySelectorAll('img').forEach(img => {
      rightContent.push(img.cloneNode(true));
    });
  }

  // Build table rows
  const headerRow = ['Columns (columns4)'];
  const contentRow = [leftContent, rightContent];

  // Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the element with the table
  element.replaceWith(table);
}
