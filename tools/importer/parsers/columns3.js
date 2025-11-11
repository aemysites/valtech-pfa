/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns3)'];

  // Get immediate column divs (each column contains a teaser)
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  if (columns.length < 2) return;

  // Helper: extract all content from a column, including images and ALL text
  function extractColumnContent(col) {
    // Find the teaser div (if present)
    const teaser = col.querySelector('.teasers__teaser') || col;
    // Create a wrapper div for all content
    const wrapper = document.createElement('div');
    // Copy all child nodes (including images, text, etc.)
    Array.from(teaser.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        // Always include text nodes, even if whitespace (to preserve structure)
        if (node.textContent) {
          wrapper.appendChild(document.createTextNode(node.textContent));
        }
      } else {
        wrapper.appendChild(node.cloneNode(true));
      }
    });
    // Also extract any text content from teaser itself (not just child nodes)
    // If teaser has meaningful text not already included, add it
    const teaserText = teaser.textContent;
    if (teaserText && teaserText.trim() && !wrapper.textContent.includes(teaserText.trim())) {
      const p = document.createElement('p');
      p.textContent = teaserText.trim();
      wrapper.appendChild(p);
    }
    return wrapper;
  }

  // Extract both columns' content, ensuring all text is included
  const leftContent = extractColumnContent(columns[0]);
  const rightContent = extractColumnContent(columns[1]);

  // Table rows: first row is header, second row is columns
  const tableRows = [
    headerRow,
    [leftContent, rightContent]
  ];

  // Create and replace with block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
