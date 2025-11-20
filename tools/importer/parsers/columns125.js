/* global WebImporter */
export default function parse(element, { document }) {
  // Columns (columns125) block: two columns - image left, text right
  // Defensive selectors for immediate children
  const cols = element.querySelectorAll(':scope > div');

  // Left column: image
  let leftContent = null;
  if (cols[0]) {
    // Look for image inside first column
    const img = cols[0].querySelector('img');
    if (img) {
      leftContent = img;
    } else {
      // Fallback: use all content in first column
      leftContent = cols[0];
    }
  }

  // Right column: text (heading + paragraph)
  let rightContent = null;
  if (cols[1]) {
    // Find all children in second column
    // Usually a <p> with <strong> heading and text
    const p = cols[1].querySelector('p');
    if (p) {
      rightContent = p;
    } else {
      // Fallback: use all content in second column
      rightContent = cols[1];
    }
  }

  // Table rows
  const headerRow = ['Columns (columns125)'];
  const contentRow = [leftContent, rightContent];
  const rows = [headerRow, contentRow];

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
