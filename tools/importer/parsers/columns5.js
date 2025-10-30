/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns5)'];

  // Defensive selectors for the two columns
  const leftCol = element.querySelector('.col-sm-8');
  const rightCol = element.querySelector('.col-sm-4');

  // Left column content: heading, paragraphs, link
  let leftContent = [];
  if (leftCol) {
    // Extract heading (h5), paragraphs, and links in order
    leftCol.childNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // Only push if not an empty div
        if (node.tagName === 'H5' || node.tagName === 'P' || node.tagName === 'A') {
          leftContent.push(node);
        } else if (node.tagName === 'DIV') {
          // If DIV, check for non-empty text or children
          if (node.textContent.trim() || node.children.length) {
            leftContent.push(node);
          }
        }
      }
    });
  }

  // Right column content: image
  let rightContent = [];
  if (rightCol) {
    // Find the image inside right column
    const img = rightCol.querySelector('img');
    if (img) {
      rightContent.push(img);
    }
  }

  // Build the table rows
  const cells = [
    headerRow,
    [leftContent, rightContent]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
