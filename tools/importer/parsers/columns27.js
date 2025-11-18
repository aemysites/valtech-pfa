/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as header row
  const headerRow = ['Columns (columns27)'];

  // Get the immediate column wrappers
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Defensive: Only proceed if we have at least one column
  if (!columns.length) return;

  // Each column contains a .teasers__teaser div, which holds the content
  const contentRow = columns.map(col => {
    // Find the teaser content block
    const teaser = col.querySelector('.teasers__teaser');
    if (!teaser) return document.createElement('div'); // fallback empty div
    return teaser;
  });

  // Build the table rows
  const cells = [
    headerRow,
    contentRow
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element with new block table
  element.replaceWith(block);
}
