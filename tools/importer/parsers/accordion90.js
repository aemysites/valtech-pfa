/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion90)'];
  const rows = [headerRow];

  // Get all toggler elements
  const togglers = Array.from(element.querySelectorAll('p.accordions__toggler'));
  togglers.forEach((toggler) => {
    // Title cell: use the toggler's textContent
    const titleCell = toggler.textContent.trim();
    // Content cell: find the next .accordions__element
    let contentCell = '';
    let next = toggler.nextElementSibling;
    while (next && (!next.classList || !next.classList.contains('accordions__element'))) {
      next = next.nextElementSibling;
    }
    if (next && next.classList && next.classList.contains('accordions__element')) {
      // Get all content inside the .accordions__element
      // Use its innerHTML to preserve structure
      contentCell = document.createElement('div');
      contentCell.innerHTML = next.innerHTML;
    }
    rows.push([titleCell, contentCell]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
