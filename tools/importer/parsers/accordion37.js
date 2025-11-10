/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row (block name)
  const headerRow = ['Accordion (accordion37)'];
  const rows = [headerRow];

  // 2. Find all accordion items: toggler + content
  const togglers = Array.from(element.querySelectorAll('p.accordions__toggler'));
  togglers.forEach((toggler) => {
    // Title cell: Use the toggler's text content only
    const titleCell = toggler.textContent.trim();
    // Content cell: The next sibling with class 'accordions__element'
    let contentCell = null;
    let next = toggler.nextElementSibling;
    while (next && !next.classList.contains('accordions__element')) {
      next = next.nextElementSibling;
    }
    if (next && next.classList.contains('accordions__element')) {
      contentCell = next.cloneNode(true);
    }
    if (titleCell && contentCell) {
      rows.push([titleCell, contentCell]);
    }
  });

  // 3. Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // 4. Replace the original element with the block
  element.replaceWith(block);
}
