/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion31)'];

  // Find the main heading (section label)
  const mainHeading = element.querySelector('h5');

  // Find all accordion toggler titles and their content blocks
  const togglerNodes = Array.from(element.querySelectorAll('.accordions__toggler'));
  const rows = togglerNodes.map(toggler => {
    // The title cell: use the toggler text
    const titleText = toggler.textContent.trim();
    // The content cell: find the next sibling .accordions__element
    let contentCell = '';
    let next = toggler.nextElementSibling;
    while (next && !next.classList.contains('accordions__element')) {
      next = next.nextElementSibling;
    }
    if (next && next.classList.contains('accordions__element')) {
      // Clone the content node for safety
      contentCell = next.cloneNode(true);
    }
    return [titleText, contentCell];
  });

  // Build the table: header row + accordion rows
  const tableCells = [headerRow, ...rows];
  const blockTable = WebImporter.DOMUtils.createTable(tableCells, document);

  // If there is a main heading, insert it before the table
  if (mainHeading) {
    blockTable.parentNode?.insertBefore(mainHeading.cloneNode(true), blockTable);
  }

  // Replace the original element with the block table
  element.replaceWith(blockTable);
}
