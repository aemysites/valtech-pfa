/* global WebImporter */
export default function parse(element, { document }) {
  // Critical Review and Corrections:
  // - Extract exactly 4 columns from immediate children of .row
  // - Each column's cell must contain ALL text and inline elements from the column
  // - No hardcoded content: all text, links, and formatting must be preserved
  // - No markdown: only HTML elements
  // - Table header must be ['Columns (columns4)']
  // - No Section Metadata block
  // - No new images created (none present)
  // - No missed content

  // Get all direct column divs
  const columns = Array.from(element.querySelectorAll(':scope > .col-xs-12'));
  if (columns.length !== 4) return; // Defensive: Only process if 4 columns

  // Helper: For each column, gather all child nodes (preserving formatting)
  function extractColumnContent(col) {
    // Create a wrapper div to preserve all content and formatting
    const wrapper = document.createElement('div');
    Array.from(col.childNodes).forEach((node) => {
      // Only append non-empty nodes
      if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return;
      wrapper.appendChild(node);
    });
    return wrapper;
  }

  const headerRow = ['Columns (columns4)'];
  const contentRow = columns.map(extractColumnContent);

  // Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element with the table
  element.replaceWith(table);
}
