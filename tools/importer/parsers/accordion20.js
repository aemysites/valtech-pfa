/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Accordion (accordion20)'];
  const rows = [headerRow];

  // Find all accordion toggler elements (titles)
  const togglers = Array.from(element.querySelectorAll('.accordions__toggler'));
  // Each toggler is followed by its content element (accordions__element)
  togglers.forEach((toggler) => {
    // Title cell: use the toggler text only
    const titleCell = document.createElement('div');
    titleCell.textContent = toggler.textContent.trim();
    // Content cell: find the next sibling with class 'accordions__element'
    let contentCell = null;
    let next = toggler.nextElementSibling;
    while (next && !next.classList.contains('accordions__element')) {
      next = next.nextElementSibling;
    }
    if (next && next.classList.contains('accordions__element')) {
      // Use all child nodes for maximum flexibility
      const contentDiv = document.createElement('div');
      Array.from(next.childNodes).forEach((node) => {
        contentDiv.appendChild(node.cloneNode(true));
      });
      contentCell = contentDiv;
    } else {
      // Defensive fallback: if not found, use an empty cell
      contentCell = document.createElement('div');
    }
    rows.push([titleCell, contentCell]);
  });

  // Find the informational paragraph and link at the bottom
  // Only consider elements after the last accordion
  let lastAccordionIdx = -1;
  Array.from(element.children).forEach((child, idx) => {
    if (child.classList && child.classList.contains('accordions__element')) {
      lastAccordionIdx = idx;
    }
  });
  const bottomContent = [];
  Array.from(element.children).slice(lastAccordionIdx + 1).forEach((child) => {
    if (
      child.tagName === 'P' &&
      child.textContent.trim()
    ) {
      bottomContent.push(child.cloneNode(true));
    }
    if (
      child.tagName === 'A' &&
      child.textContent.trim()
    ) {
      bottomContent.push(child.cloneNode(true));
    }
  });
  if (bottomContent.length) {
    const infoDiv = document.createElement('div');
    bottomContent.forEach((node) => infoDiv.appendChild(node));
    rows.push([
      document.createTextNode('Info'),
      infoDiv
    ]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
