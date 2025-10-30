/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main row containing the columns
  const row = element.querySelector('.row.teasers') || element;
  // Find the two column divs
  const leftCol = row.querySelector('.col-sm-9') || row.querySelector('.col-xs-12');
  const rightCol = row.querySelector('.col-sm-3');

  // Prepare the table header as required
  const headerRow = ['Columns (columns6)'];

  // Prepare the table content row
  const contentRow = [leftCol, rightCol];

  // Create the columns table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element with the table
  element.replaceWith(table);
}
