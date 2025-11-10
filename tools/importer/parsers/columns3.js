/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the required header row for Columns (columns3)
  const headerRow = ['Columns (columns3)'];

  // Find the two columns in the source html
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Helper to collect all text content from a column (including from images' alt attributes)
  function extractColumnContent(col) {
    const content = [];
    if (!col) return [''];
    // Add all text content (including from child elements)
    const text = col.innerText ? col.innerText.trim() : '';
    if (text) {
      content.push(document.createTextNode(text));
    }
    // Add all images (if any)
    Array.from(col.querySelectorAll('img')).forEach(img => {
      content.push(img);
    });
    return content.length ? content : [''];
  }

  // Build the table rows for the block
  const rows = [
    headerRow,
    [
      extractColumnContent(columns[0]),
      extractColumnContent(columns[1])
    ]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
