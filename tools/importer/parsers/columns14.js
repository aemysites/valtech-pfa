/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns14)'];

  // Defensive: Find the main content container
  // The main content is inside the first .col-sm-12
  const col = element.querySelector('.col-sm-12');
  // If not found, fallback to the first child div
  const contentRoot = col || element.querySelector('div');

  // Gather all direct children of the content root
  // We'll treat all content as a single column, as per screenshot and markdown
  const children = Array.from(contentRoot.childNodes).filter(node => {
    // Only include element nodes and non-empty text nodes
    return (node.nodeType === 1) || (node.nodeType === 3 && node.textContent.trim());
  });

  // Create a single cell with all content elements
  // This matches the screenshot: one column with heading, paragraphs, list
  const contentCell = [children];

  // Build the table rows
  const rows = [
    headerRow,
    contentCell,
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
