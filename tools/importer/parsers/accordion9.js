/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block: 2 columns, multiple rows, first row is block name
  const headerRow = ['Accordion (accordion9)'];
  const rows = [headerRow];

  // Collect all children of the element
  const allChildren = Array.from(element.children);

  // Find indices for accordion togglers and elements
  const togglerIndices = allChildren
    .map((el, i) => el.classList.contains('accordions__toggler') ? i : -1)
    .filter(i => i !== -1);
  const accordionIndices = allChildren
    .map((el, i) => el.classList.contains('accordions__element') ? i : -1)
    .filter(i => i !== -1);

  // Everything before the first toggler is intro content
  if (togglerIndices.length && togglerIndices[0] > 0) {
    const frag = document.createElement('div');
    allChildren.slice(0, togglerIndices[0]).forEach((el) => frag.appendChild(el.cloneNode(true)));
    // Place intro content in the first cell, second cell empty
    rows.push([frag, '']);
  }

  // For each toggler, pair with its accordion content
  togglerIndices.forEach((tIdx, i) => {
    const toggler = allChildren[tIdx];
    // Title cell: use only the text content of the toggler
    const titleCell = toggler.textContent.trim();
    // Content cell: find the next sibling .accordions__element
    let contentCell = '';
    let next = toggler.nextElementSibling;
    while (next && !next.classList.contains('accordions__element')) {
      next = next.nextElementSibling;
    }
    if (next && next.classList.contains('accordions__element')) {
      const frag = document.createElement('div');
      Array.from(next.childNodes).forEach((node) => frag.appendChild(node.cloneNode(true)));
      contentCell = frag;
    }
    rows.push([titleCell, contentCell]);
  });

  // Everything after the last accordion element is outro content
  if (accordionIndices.length) {
    const lastAccordionIdx = accordionIndices[accordionIndices.length - 1];
    if (lastAccordionIdx < allChildren.length - 1) {
      const frag = document.createElement('div');
      allChildren.slice(lastAccordionIdx + 1).forEach((el) => frag.appendChild(el.cloneNode(true)));
      // Place outro content in the first cell, second cell empty
      rows.push([frag, '']);
    }
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
