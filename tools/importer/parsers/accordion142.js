/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as required
  const headerRow = ['Accordion (accordion142)'];

  // Extract heading and intro paragraph to place above the accordion block
  const h2 = element.querySelector('h2');
  const introParas = [];
  let node = h2 ? h2.nextElementSibling : element.firstElementChild;
  const firstToggler = element.querySelector('p.accordions__toggler');
  while (node && node !== firstToggler) {
    if (node.tagName === 'P' && node.textContent.trim()) {
      introParas.push(node.cloneNode(true));
    }
    node = node.nextElementSibling;
  }

  // Find all toggler titles and their corresponding content blocks
  const rows = [];
  const togglers = Array.from(element.querySelectorAll('p.accordions__toggler'));
  togglers.forEach((toggler) => {
    // Title cell: use only the text content of the toggler
    const titleCell = toggler.textContent.trim();
    // Content cell: find the next sibling .accordions__element and use only its children
    let contentCell = document.createElement('div');
    let next = toggler.nextElementSibling;
    while (next && !next.classList.contains('accordions__element')) {
      next = next.nextElementSibling;
    }
    if (next && next.classList.contains('accordions__element')) {
      // Move all children of the .accordions__element into the content cell
      Array.from(next.childNodes).forEach((child) => {
        contentCell.appendChild(child.cloneNode(true));
      });
    }
    rows.push([titleCell, contentCell]);
  });

  // Compose the table data
  const tableData = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Insert heading and intro paragraph above the accordion table
  if (h2) {
    element.parentNode.insertBefore(h2.cloneNode(true), element);
  }
  introParas.forEach((para) => {
    element.parentNode.insertBefore(para, element);
  });

  // Replace the original element with the block table
  element.replaceWith(block);
}
