/* global WebImporter */
export default function parse(element, { document }) {
  // Find main content container
  const container = element.querySelector('.container-fluid') || element;
  const row = container.querySelector('.row.teasers') || container;
  const col = row.querySelector('.col-sm-12') || row;

  // Find accordion toggler (title)
  const toggler = col.querySelector('.accordions__toggler');
  // Find accordion content element
  const accordionElement = col.querySelector('.accordions__element');

  // Compose header row
  const headerRow = ['Accordion (accordion8)'];

  // Compose accordion item row
  // Title cell: toggler text
  // Content cell: only one table (show-in-print preferred), plus notes outside the table (no duplication)
  let contentCell = '';
  if (accordionElement) {
    // Prefer the table.show-in-print, but fallback to hide-in-print
    let table = accordionElement.querySelector('table.show-in-print') || accordionElement.querySelector('table.hide-in-print');
    // Collect notes that are direct children and not inside the table
    const notes = [];
    Array.from(accordionElement.children).forEach(child => {
      if (child.tagName !== 'TABLE' && child.textContent && child.textContent.trim()) {
        notes.push(child.cloneNode(true));
      }
    });
    // Compose content cell as an array: table (if exists), then notes (if any)
    const contentArr = [];
    if (table) contentArr.push(table);
    if (notes.length) contentArr.push(...notes);
    contentCell = contentArr.length ? contentArr : '';
  }

  const titleCell = toggler ? toggler.textContent.trim() : '';

  // Compose rows
  const rows = [headerRow];
  if (titleCell) {
    rows.push([titleCell, contentCell]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
