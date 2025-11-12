/* global WebImporter */
export default function parse(element, { document }) {
  // Find the visible heading and all <p> up to the first accordion toggler
  const heading = element.querySelector('h2:not([style*="display:none"])');
  const firstToggler = element.querySelector('p.accordions__toggler');
  const introParas = [];
  if (heading && firstToggler) {
    let node = heading.nextElementSibling;
    while (node && node !== firstToggler) {
      if (node.tagName === 'P') introParas.push(node);
      node = node.nextElementSibling;
    }
  }

  // Insert heading and intro paragraphs before the block (not in a table)
  const introFragment = document.createDocumentFragment();
  if (heading) introFragment.appendChild(heading.cloneNode(true));
  introParas.forEach(p => introFragment.appendChild(p.cloneNode(true)));

  // Accordion block rows
  const rows = [];
  rows.push(['Accordion (accordion33)']);
  const togglers = Array.from(element.querySelectorAll('p.accordions__toggler'));
  togglers.forEach((toggler) => {
    // Title cell: Use the toggler's text content only
    const titleCell = toggler.textContent.trim();
    // Content cell: Find the next sibling with class 'accordions__element'
    let contentCell = null;
    let next = toggler.nextElementSibling;
    while (next && !next.classList.contains('accordions__element')) {
      next = next.nextElementSibling;
    }
    if (next && next.classList.contains('accordions__element')) {
      contentCell = next;
    } else {
      contentCell = document.createElement('div');
    }
    rows.push([titleCell, contentCell]);
  });
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with fragment + block
  if (introFragment.childNodes.length) {
    element.replaceWith(introFragment, block);
  } else {
    element.replaceWith(block);
  }
}
