/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified
  const headerRow = ['Columns (columns15)'];

  // Defensive: find the main row containing the columns
  const mainRow = element.querySelector('.container-fluid > .row');
  if (!mainRow) return;

  // Find the four column containers (three nav columns, one address/social column)
  // The first three are inside col-xs-landscape-6 col-sm-6 col-md-9 > .row > .col-md-4
  // The fourth is col-xs-landscape-6 col-sm-6 col-md-3
  const colGroup = mainRow.querySelector('.col-xs-landscape-6.col-sm-6.col-md-9 > .row');
  const navCols = colGroup ? Array.from(colGroup.children) : [];
  const contactCol = mainRow.querySelector('.col-xs-landscape-6.col-sm-6.col-md-3');

  // Defensive: ensure we have the expected columns
  if (navCols.length !== 3 || !contactCol) return;

  // Helper to extract the full column block (heading + list)
  function extractNavCol(col) {
    // We'll include the heading and its list as a block
    const heading = col.querySelector('.footer__heading');
    const wrapper = col.querySelector('.footer__wrapper');
    // Defensive: fallback to all children if wrapper not found
    if (heading && wrapper) {
      return [heading, wrapper];
    } else {
      // fallback: return all children
      return Array.from(col.children);
    }
  }

  // For the contact/social column, include heading, address, and social links
  function extractContactCol(col) {
    const heading = col.querySelector('.footer__heading');
    const address = col.querySelector('address');
    const social = col.querySelector('.share--footer');
    const result = [];
    if (heading) result.push(heading);
    if (address) result.push(address);
    if (social) result.push(social);
    return result;
  }

  // Build the columns row
  const columnsRow = [
    extractNavCol(navCols[0]),
    extractNavCol(navCols[1]),
    extractNavCol(navCols[2]),
    extractContactCol(contactCol)
  ];

  // Compose the table
  const cells = [headerRow, columnsRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
