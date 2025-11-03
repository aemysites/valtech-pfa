/* global WebImporter */
export default function parse(element, { document }) {
  // Always start with the block header row
  const headerRow = ['Columns (columns18)'];

  // Defensive: Get all immediate column containers
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Each column will be a cell in the second row
  const cells = columns.map((col) => {
    // Defensive: gather all direct children (teasers, headings, paragraphs, etc.)
    // We'll collect all content inside this column as a single cell
    // This will ensure resilience to variations in teaser structure
    const content = Array.from(col.childNodes).filter((node) => {
      // Only include elements and meaningful text nodes
      return (
        node.nodeType === 1 ||
        (node.nodeType === 3 && node.textContent.trim())
      );
    });
    return content;
  });

  // Build the table rows: header + content row
  const tableRows = [headerRow, cells];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}
