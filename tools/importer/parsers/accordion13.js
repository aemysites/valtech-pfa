/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion13)'];

  // Find the main accordion title as plain text
  const mainTitleEl = element.querySelector('.accordions__toggler');
  const mainTitle = mainTitleEl ? mainTitleEl.textContent.trim() : '';

  // Find the accordion content (all tables inside all .accordions__element)
  const accordionElements = element.querySelectorAll('.accordions__element');
  const frag = document.createDocumentFragment();
  accordionElements.forEach(accEl => {
    accEl.querySelectorAll('table').forEach(table => frag.appendChild(table));
  });

  // Build rows: header, then one accordion item row (main title, all tables)
  const rows = [
    headerRow,
    [mainTitle, frag]
  ];

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
