/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion114)'];

  // Find the main content container
  const container = element.querySelector('.container-fluid');
  if (!container) return;

  // Get the heading and intro text (above the accordions)
  const heading = container.querySelector('h2:not([style*="display:none"])');
  const intro = container.querySelector('p');

  // Find all accordion toggler paragraphs and their corresponding content elements
  const togglers = Array.from(container.querySelectorAll('p.accordions__toggler'));
  const elements = Array.from(container.querySelectorAll('.accordions__element'));

  const rows = [];

  // Insert heading and intro as the first accordion row (if present)
  if (heading || intro) {
    const introBlock = document.createElement('div');
    if (heading) introBlock.appendChild(heading.cloneNode(true));
    if (intro) introBlock.appendChild(intro.cloneNode(true));
    rows.push(['Intro', introBlock]);
  }

  // Pair up togglers and elements
  if (togglers.length && elements.length && togglers.length === elements.length) {
    for (let i = 0; i < togglers.length; i++) {
      const titleCell = togglers[i];
      const contentCell = elements[i];
      rows.push([titleCell, contentCell]);
    }
  }

  // Build the table: header, then rows
  const cells = [headerRow, ...rows];

  // Replace the original element with the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
