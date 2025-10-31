/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Accordion (accordion5)
  const headerRow = ['Accordion (accordion5)'];

  // Find heading and intro paragraph
  const h2 = element.querySelector('h2');
  const introP = h2 && h2.nextElementSibling && h2.nextElementSibling.tagName === 'P' ? h2.nextElementSibling : null;

  // Find the accordion toggler (title)
  const toggler = element.querySelector('.accordions__toggler');

  // Find the accordion content (the next sibling after toggler)
  let content = null;
  if (toggler) {
    let next = toggler.nextElementSibling;
    if (next && next.classList.contains('accordions__element')) {
      // Only keep one table (prefer .table.hide-in-print if present)
      const table = next.querySelector('.table.hide-in-print') || next.querySelector('.table.show-in-print');
      // Also include any non-empty notes (e.g. explanatory paragraphs)
      const cleaned = document.createElement('div');
      if (table) cleaned.appendChild(table.cloneNode(true));
      next.querySelectorAll('p, span').forEach((el) => {
        if (el.textContent.trim()) cleaned.appendChild(el.cloneNode(true));
      });
      content = cleaned;
    }
  }

  // Compose the accordion item row
  const accordionRows = [];
  if (toggler && content) {
    // Compose a wrapper for heading and intro paragraph
    const wrapper = document.createElement('div');
    if (h2) wrapper.appendChild(h2.cloneNode(true));
    if (introP) wrapper.appendChild(introP.cloneNode(true));
    accordionRows.push([
      toggler.textContent.trim(), // Title cell: only text
      [wrapper, content] // Content cell: heading, intro, and accordion details
    ]);
  }

  // Compose the final table cells
  const cells = [
    headerRow,
    ...accordionRows
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
