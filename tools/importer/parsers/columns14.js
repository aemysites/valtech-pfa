/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get immediate child columns (two columns)
  const columns = Array.from(element.querySelectorAll(':scope .col-sm-6.col-xs-12'));

  // Defensive: If not found, fallback to any direct children with col-sm-6
  if (columns.length === 0) {
    const row = element.querySelector(':scope .row');
    if (row) {
      columns.push(...row.querySelectorAll(':scope > .col-sm-6'));
    }
  }

  // Prepare header row
  const headerRow = ['Columns (columns14)'];

  // Extract left column (text content)
  let leftContent = null;
  if (columns[0]) {
    leftContent = columns[0];
  }

  // Extract right column (video embed)
  let rightContent = null;
  if (columns[1]) {
    // Look for iframe
    const iframe = columns[1].querySelector('iframe');
    if (iframe) {
      // Convert iframe to a link to its src
      const videoLink = document.createElement('a');
      videoLink.href = iframe.src;
      videoLink.textContent = iframe.src;
      rightContent = videoLink;
    } else {
      // Fallback: Use the whole column if no iframe found
      rightContent = columns[1];
    }
  }

  // Compose table rows
  const rows = [
    headerRow,
    [leftContent, rightContent]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
