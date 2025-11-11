/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns27)'];

  // Defensive: Get all immediate children that are columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // For each column, grab the content block (teaser)
  const contentRow = columns.map((col) => {
    // Defensive: Find the teaser block inside the column
    const teaser = col.querySelector('.teasers__teaser') || col;
    // Return the teaser element directly (includes heading, paragraph, and link)
    return teaser;
  });

  // Build the table rows
  const rows = [headerRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
