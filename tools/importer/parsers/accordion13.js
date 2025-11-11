/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion13)'];

  // Find the accordion toggler/title
  const titleEl = element.querySelector('.accordions__toggler');
  // Defensive: If no title found, fallback to first <p> inside element
  const title = titleEl || element.querySelector('p');

  // Find the content for the accordion item
  // In this case, all tables inside .accordions__element are the content
  const contentWrapper = element.querySelector('.accordions__element');
  let contentCells = [];
  if (contentWrapper) {
    // Find all .col-xs-12.col-sm-6
    const cols = contentWrapper.querySelectorAll('.row > .col-xs-12.col-sm-6');
    cols.forEach((col) => {
      // Find all tables inside each col
      const tables = col.querySelectorAll('table');
      tables.forEach((table) => {
        contentCells.push(table);
      });
    });
  }

  // If no content found, fallback to all tables in the block
  if (contentCells.length === 0) {
    const tables = element.querySelectorAll('table');
    tables.forEach((table) => {
      contentCells.push(table);
    });
  }

  // If still no content, fallback to all children of .accordions__element
  if (contentCells.length === 0 && contentWrapper) {
    contentCells = Array.from(contentWrapper.children);
  }

  // Accordion row: [title, content]
  const accordionRow = [title, contentCells];

  // Build the table rows
  const rows = [headerRow, accordionRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
