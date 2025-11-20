/* global WebImporter */
export default function parse(element, { document }) {
  // Build table rows
  const rows = [];
  // Header row
  rows.push(['Accordion (accordion39)']);

  // Collect all headings and paragraphs (including FAQ intro) before any accordion toggler
  let node = element.firstElementChild;
  while (node) {
    if (node.tagName === 'P' && node.classList.contains('accordions__toggler')) break;
    if ((node.tagName === 'H2' || node.tagName === 'H3' || node.tagName === 'P') && node.textContent.trim()) {
      rows.push([node.cloneNode(true), '']);
    }
    node = node.nextElementSibling;
  }

  // Accordion items: toggler/content pairs
  const togglers = Array.from(element.querySelectorAll('p.accordions__toggler'));
  const contents = Array.from(element.querySelectorAll('div.accordions__element'));
  for (let i = 0; i < togglers.length && i < contents.length; i++) {
    rows.push([
      togglers[i].cloneNode(true),
      contents[i].cloneNode(true)
    ]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
