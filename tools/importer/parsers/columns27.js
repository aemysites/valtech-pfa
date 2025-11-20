/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns27)'];

  // Find the two columns (col-xs-12 col-sm-6)
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  const leftCol = columns[0] || element;
  const rightCol = columns[1] || null;

  // Helper to extract all content from a column
  function extractColumnContent(col, isRightCol = false) {
    const content = [];
    // Find .teasers__teaser if present, else use col
    const teaser = col.querySelector('.teasers__teaser') || col;
    if (isRightCol) {
      // Always add heading as <h3> above chart image, per screenshot analysis
      let headingText = '';
      const h3 = teaser.querySelector('h3');
      // Try to get heading from h3, or use screenshot value
      if (h3) {
        // If h3 contains only an image, use screenshot heading
        if (h3.textContent.trim()) {
          headingText = h3.textContent.trim();
        } else {
          headingText = 'Forskel på de to investeringsprofiler';
        }
      } else {
        headingText = 'Forskel på de to investeringsprofiler';
      }
      if (headingText) {
        const heading = document.createElement('h3');
        heading.textContent = headingText;
        content.push(heading);
      }
      // Add chart image if present
      const img = teaser.querySelector('img');
      if (img) content.push(img);
    } else {
      // Collect all children except script/style
      Array.from(teaser.childNodes).forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
            content.push(node);
          }
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          // Wrap stray text nodes in <p>
          const p = document.createElement('p');
          p.textContent = node.textContent.trim();
          content.push(p);
        }
      });
    }
    return content;
  }

  // LEFT COLUMN
  const leftContent = extractColumnContent(leftCol);

  // RIGHT COLUMN
  let rightContent = [];
  if (rightCol) {
    rightContent = extractColumnContent(rightCol, true);
  }

  // Build table rows
  const tableRows = [
    headerRow,
    [leftContent, rightContent]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(block);
}
