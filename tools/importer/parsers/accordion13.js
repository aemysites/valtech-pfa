/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion13)'];

  // Find the toggler/title for the accordion item
  const titleEl = element.querySelector('.accordions__toggler');
  const title = titleEl ? titleEl.textContent.trim() : '';

  // Find all tables that are part of the accordion content
  // These are inside .accordions__element .table-responsive
  const contentTables = Array.from(element.querySelectorAll('.accordions__element .table-responsive'));
  // Compose a fragment with all tables
  const contentFragment = document.createDocumentFragment();
  contentTables.forEach(tableWrap => {
    // Clone all tables inside the wrapper
    Array.from(tableWrap.querySelectorAll('table')).forEach(table => {
      contentFragment.appendChild(table.cloneNode(true));
    });
  });

  // Compose the rows for the block table
  const rows = [headerRow, [title, contentFragment]];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
