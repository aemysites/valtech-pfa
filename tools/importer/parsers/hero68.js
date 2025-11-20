/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero68) block parsing
  // Table: 1 column, 3 rows
  // Row 1: Block name
  // Row 2: (optional) Background image - none in this case
  // Row 3: Heading, subheading, CTA - only heading present

  // Header row
  const headerRow = ['Hero (hero68)'];

  // Row 2: Background image (none)
  const imageRow = [''];

  // Row 3: Content (heading)
  // Find the h1 element inside the block
  const h1 = element.querySelector('h1');
  // Defensive: If not found, fallback to text content
  const contentCell = h1 ? h1 : document.createTextNode(element.textContent.trim());
  const contentRow = [contentCell];

  // Assemble table
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
