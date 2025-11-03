/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main row containing the columns
  const mainRow = element.querySelector('.row');
  if (!mainRow) return;

  // Get all direct column divs (should be 4)
  const columns = Array.from(mainRow.children);
  if (columns.length < 4) return;

  // Helper to extract heading and list for the first three columns
  function extractColumn(col) {
    const cellContent = [];
    const heading = col.querySelector('.footer__heading');
    if (heading) cellContent.push(heading.cloneNode(true));
    // Accordion/list content
    const wrapper = col.querySelector('.footer__wrapper');
    if (wrapper) {
      const list = wrapper.querySelector('ul.footer__list');
      if (list) cellContent.push(list.cloneNode(true));
    }
    return cellContent.length ? cellContent : [col.cloneNode(true)]; // fallback to full column if empty
  }

  // First three columns: heading + list
  const col1 = extractColumn(columns[0]);
  const col2 = extractColumn(columns[1]);
  const col3 = extractColumn(columns[2]);

  // Fourth column: heading + address + social icons
  const col4Content = [];
  const heading4 = columns[3].querySelector('.footer__heading');
  if (heading4) col4Content.push(heading4.cloneNode(true));
  const address = columns[3].querySelector('address');
  if (address) col4Content.push(address.cloneNode(true));
  const socials = columns[3].querySelector('.share--footer');
  if (socials) col4Content.push(socials.cloneNode(true));
  if (!col4Content.length) col4Content.push(columns[3].cloneNode(true)); // fallback

  // Table header must match block name exactly
  const headerRow = ['Columns (columns20)'];
  // Table row: each cell is an array of referenced DOM elements
  const row = [col1, col2, col3, col4Content];

  const table = WebImporter.DOMUtils.createTable([headerRow, row], document);
  if (table) element.replaceWith(table);
}
