/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block: 2 columns, first row is header, each row is [title, content]
  const headerRow = ['Accordion (accordion10)'];
  const cells = [headerRow];

  // --- FIX: Add heading and intro paragraph as a single cell row before accordion items ---
  const heading = element.querySelector('h2');
  const intro = Array.from(element.querySelectorAll('p')).find(p => !p.classList.contains('accordions__toggler'));
  if (heading || intro) {
    const introDiv = document.createElement('div');
    if (heading) introDiv.appendChild(heading.cloneNode(true));
    if (intro) introDiv.appendChild(intro.cloneNode(true));
    cells.push([introDiv]); // Only one cell, no empty column
  }

  // Extract accordion items as rows after the intro
  const togglers = Array.from(element.querySelectorAll('p.accordions__toggler'));
  togglers.forEach((toggler) => {
    // Title cell: the toggler itself
    const titleCell = toggler;
    // Content cell: the next sibling with class 'accordions__element'
    let contentCell = null;
    let next = toggler.nextElementSibling;
    while (next && !next.classList.contains('accordions__element')) {
      next = next.nextElementSibling;
    }
    if (next && next.classList.contains('accordions__element')) {
      contentCell = next;
    } else {
      // Defensive: If not found, leave cell empty
      contentCell = document.createElement('div');
    }
    cells.push([titleCell, contentCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(table);
}
