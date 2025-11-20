/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns119)'];

  // Defensive: Get immediate column divs
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // There should be two columns: left (text), right (image)
  // Left column: all text content (heading, paragraphs, link)
  // Right column: image (possibly wrapped in a link)

  // Find the teaser content in each column
  const leftCol = columns[0];
  const rightCol = columns[1];

  // Defensive: fallback if structure changes
  let leftContent, rightContent;

  // Left column: find .teasers__teaser and use its children
  if (leftCol) {
    const leftTeaser = leftCol.querySelector('.teasers__teaser') || leftCol;
    leftContent = Array.from(leftTeaser.childNodes).filter(node => {
      // Only keep elements (h3, p, a, etc) and non-empty text nodes
      return (node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim()));
    });
  } else {
    leftContent = [];
  }

  // Right column: find image (possibly wrapped in a link)
  if (rightCol) {
    const rightTeaser = rightCol.querySelector('.teasers__teaser') || rightCol;
    // Find the image or its parent link
    const imgLink = rightTeaser.querySelector('a');
    if (imgLink) {
      rightContent = [imgLink];
    } else {
      const img = rightTeaser.querySelector('img');
      rightContent = img ? [img] : [];
    }
  } else {
    rightContent = [];
  }

  // Build table rows: header, then one row with two columns
  const rows = [
    headerRow,
    [leftContent, rightContent]
  ];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
