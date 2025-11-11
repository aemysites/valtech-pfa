/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion12)'];

  // Find all accordion toggler titles and their content
  // Each accordion item: title (toggler), content (next sibling)
  // The toggler is a <p> with class 'accordions__toggler'
  const togglers = Array.from(element.querySelectorAll('p.accordions__toggler'));
  const rows = [];

  togglers.forEach((toggler) => {
    // Title cell: the toggler itself (reference, not clone)
    const titleCell = toggler;

    // Content cell: the next sibling .accordions__element
    let contentCell = null;
    let sibling = toggler.nextElementSibling;
    while (sibling && !sibling.classList.contains('accordions__element')) {
      sibling = sibling.nextElementSibling;
    }
    // Reference the actual element, not a clone
    if (sibling && sibling.classList.contains('accordions__element')) {
      contentCell = sibling;
    }
    // Defensive: If not found, leave cell empty
    rows.push([titleCell, contentCell || document.createElement('div')]);
  });

  // Build the table: header row, then accordion items
  const tableCells = [headerRow, ...rows];
  const blockTable = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace the original element with the block table
  element.replaceWith(blockTable);
}
