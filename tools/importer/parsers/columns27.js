/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns27)'];

  // Find all immediate column children (should be two columns)
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Defensive: Only proceed if we have at least one column
  if (!columns.length) return;

  // For each column, extract the teaser block (heading, paragraph, link)
  const contentRow = columns.map((col) => {
    // Find the teaser inside the column
    const teaser = col.querySelector('.teasers__teaser') || col;
    // We'll collect all direct children: heading, paragraph, and links
    const cells = [];
    // Heading (h3)
    const heading = teaser.querySelector('h3');
    if (heading) cells.push(heading);
    // Paragraph (first p)
    const paragraph = teaser.querySelector('p');
    if (paragraph) cells.push(paragraph);
    // Link (first a inside ul.panel__links)
    const link = teaser.querySelector('ul.panel__links a');
    if (link) cells.push(link);
    // Compose a fragment for this column
    const frag = document.createElement('div');
    cells.forEach((el) => frag.appendChild(el));
    return frag;
  });

  // Table: header row, then one row with two columns
  const tableCells = [headerRow, contentRow];
  const blockTable = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace the original element with the new block table
  element.replaceWith(blockTable);
}
