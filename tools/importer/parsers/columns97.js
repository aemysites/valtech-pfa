/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns97)'];

  // Defensive: get immediate column children
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  // If not exactly 2 columns, fallback to all children as columns
  const numCols = columns.length === 2 ? 2 : columns.length;

  // Left column: expects image and caption
  let leftColContent = [];
  if (columns[0]) {
    // Get image (if present)
    const img = columns[0].querySelector('img');
    if (img) leftColContent.push(img);

    // Get caption (em or other text under image)
    const em = columns[0].querySelector('em');
    if (em) leftColContent.push(em);
  }

  // Right column: expects text content (paragraphs)
  let rightColContent = [];
  if (columns[1]) {
    // Find all paragraphs and divs containing text
    const teaser = columns[1].querySelector('.teasers__teaser');
    if (teaser) {
      // Use the entire teaser div for resilience
      rightColContent.push(teaser);
    } else {
      // Fallback: grab all paragraphs
      const paras = Array.from(columns[1].querySelectorAll('p'));
      rightColContent = rightColContent.concat(paras);
    }
  }

  // Build the table rows
  const rows = [
    headerRow,
    [leftColContent, rightColContent]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
