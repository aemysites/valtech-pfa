/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion37)'];
  const rows = [headerRow];

  // 1. Gather all accordion items: each row is [title, content]
  const togglers = Array.from(element.querySelectorAll('p.accordions__toggler'));
  togglers.forEach(toggler => {
    // Title cell: use toggler text only
    const titleCell = document.createElement('div');
    titleCell.textContent = toggler.textContent;
    // Content cell: find the next sibling .accordions__element
    let contentCell = null;
    let sibling = toggler.nextElementSibling;
    while (sibling && !sibling.classList.contains('accordions__element')) {
      sibling = sibling.nextElementSibling;
    }
    if (sibling && sibling.classList.contains('accordions__element')) {
      contentCell = sibling.cloneNode(true);
    } else {
      contentCell = document.createElement('div');
    }
    rows.push([titleCell, contentCell]);
  });

  // Replace original element with block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
