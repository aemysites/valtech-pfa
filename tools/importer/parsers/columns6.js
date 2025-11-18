/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Columns block
  const headerRow = ['Columns (columns6)'];

  // Find the two column divs
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Defensive: Ensure we have at least two columns
  if (columns.length < 2) return;

  // Left column: collect all teaser content (text, list, link)
  const leftCol = columns[0];
  // Gather all children of leftCol (teaser divs)
  const leftTeasers = Array.from(leftCol.querySelectorAll(':scope > div'));
  const leftContent = [];
  leftTeasers.forEach(teaser => {
    // Add all children (text, ul, p, etc.)
    Array.from(teaser.childNodes).forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
        leftContent.push(node.cloneNode(true));
      }
    });
  });

  // Right column: image only
  const rightCol = columns[1];
  const img = rightCol.querySelector('img');
  const rightContent = img ? [img.cloneNode(true)] : [];

  // Table structure: header, then one row with two columns
  const cells = [
    headerRow,
    [leftContent, rightContent]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
