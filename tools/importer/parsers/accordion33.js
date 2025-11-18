/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion33)'];
  const rows = [headerRow];

  // --- FIX: Include heading and intro paragraphs above the accordion ---
  // Find the heading and intro paragraphs before the first toggler
  const firstToggler = element.querySelector('p.accordions__toggler');
  let introNodes = [];
  if (firstToggler) {
    let node = element.firstElementChild;
    while (node && node !== firstToggler) {
      // Only include headings and paragraphs (skip hidden h2)
      if (
        (node.tagName === 'H2' && node.style.display !== 'none') ||
        node.tagName === 'P'
      ) {
        introNodes.push(node.cloneNode(true));
      }
      node = node.nextElementSibling;
    }
    if (introNodes.length) {
      // Put all intro nodes into a single cell in a row before accordion items
      const introCell = document.createElement('div');
      introNodes.forEach(n => introCell.appendChild(n));
      rows.push([introCell, '']);
    }
  }

  // Find all toggler paragraphs and their associated content
  const togglers = Array.from(element.querySelectorAll('p.accordions__toggler'));
  togglers.forEach((toggler) => {
    // The content div is the next sibling with class 'accordions__element'
    let content = toggler.nextElementSibling;
    if (!content || !content.classList.contains('accordions__element')) {
      // Defensive: skip if structure is broken
      return;
    }
    // Title cell: use the toggler paragraph directly
    const titleCell = toggler;
    // Content cell: use the content div directly
    const contentCell = content;
    rows.push([titleCell, contentCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the block
  element.replaceWith(block);
}
