/* global WebImporter */
export default function parse(element, { document }) {
  // Always start with the block name as the header row
  const headerRow = ['Columns (columns27)'];

  // Defensive: Get immediate column containers
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // For each column, collect its teaser content (heading, paragraph, links)
  const contentRow = columns.map(col => {
    // Find the teaser block inside the column
    const teaser = col.querySelector('.teasers__teaser') || col;
    // We'll collect all child elements: heading, paragraph, and links
    const cells = [];
    // Heading
    const heading = teaser.querySelector('h3');
    if (heading) cells.push(heading);
    // Paragraph
    const para = teaser.querySelector('p');
    if (para) cells.push(para);
    // Links (ul.panel__links > li > a)
    const linksList = teaser.querySelector('.panel__links');
    if (linksList) {
      // Get all direct anchor links
      const links = Array.from(linksList.querySelectorAll('a'));
      if (links.length) {
        // If multiple links, put them in a fragment
        if (links.length === 1) {
          cells.push(links[0]);
        } else {
          const frag = document.createDocumentFragment();
          links.forEach(link => frag.appendChild(link));
          cells.push(frag);
        }
      }
    }
    // Return all collected elements as a single cell
    // If no content, return an empty string
    if (cells.length === 0) return '';
    // If only one element, return it directly
    if (cells.length === 1) return cells[0];
    // Otherwise, group them in a fragment
    const frag = document.createDocumentFragment();
    cells.forEach(el => frag.appendChild(el));
    return frag;
  });

  // Each column's content is grouped into a single cell, so the row is an array of cells
  const tableRows = [headerRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(block);
}
