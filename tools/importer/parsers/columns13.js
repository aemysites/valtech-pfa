/* global WebImporter */
export default function parse(element, { document }) {
  // Find the .row.teasers container
  const rowDiv = element.querySelector('.row.teasers');
  if (!rowDiv) return;

  // Find the .col-sm-12 container inside .row.teasers
  const colSm12Div = rowDiv.querySelector('.col-sm-12');
  if (!colSm12Div) return;

  // Get the two columns inside colSm12Div
  const mainContentDiv = colSm12Div.querySelector('.col-sm-9');
  const sidebarDiv = colSm12Div.querySelector('.col-sm-3');
  if (!mainContentDiv || !sidebarDiv) return;

  // Table header
  const headerRow = ['Columns (columns13)'];

  // Table content row: two columns, left and right
  const contentRow = [mainContentDiv, sidebarDiv];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
