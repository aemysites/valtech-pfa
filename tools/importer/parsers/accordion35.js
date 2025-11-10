/* global WebImporter */
export default function parse(element, { document }) {
  // Find all accordion toggler elements
  const togglerSelector = 'p.accordions__toggler';
  const togglers = Array.from(element.querySelectorAll(togglerSelector));

  // Build cells: header row must be a single cell array
  const cells = [[ 'Accordion (accordion35)' ]];

  togglers.forEach((toggler) => {
    // Title cell: only the plain text
    const titleCell = toggler.textContent.trim();
    // Content cell: find the next sibling .accordions__element
    let contentCell = null;
    let next = toggler.nextElementSibling;
    while (next && !next.classList.contains('accordions__element')) {
      next = next.nextElementSibling;
    }
    if (next && next.classList.contains('accordions__element')) {
      contentCell = next;
    } else {
      // Defensive: fallback to empty cell if not found
      contentCell = document.createElement('div');
    }
    cells.push([titleCell, contentCell]);
  });

  // Create the table using WebImporter utility
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the table
  element.replaceWith(table);
}
