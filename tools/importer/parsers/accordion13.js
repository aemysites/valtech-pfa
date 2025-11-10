/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the correct header row
  const headerRow = ['Accordion (accordion13)'];
  const rows = [headerRow];

  // Find the accordion toggler/title
  const titleEl = element.querySelector('.accordions__toggler');
  const title = titleEl ? titleEl.textContent.trim() : '';

  // Find all tables inside the accordion element
  const accordionElement = element.querySelector('.accordions__element');
  let tables = [];
  if (accordionElement) {
    tables = Array.from(accordionElement.querySelectorAll('table'));
  }
  // Fallback: if no tables found, get all tables in element
  if (tables.length === 0) {
    tables = Array.from(element.querySelectorAll('table'));
  }

  // Only add row if we have a title and content
  if (title && tables.length) {
    rows.push([title, tables]);
  }

  // Build and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
