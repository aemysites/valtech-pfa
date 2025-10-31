/* global WebImporter */
export default function parse(element, { document }) {
  // Collect the four columns in the footer
  const columns = [];

  // First three columns: .row > .col-md-4 inside .col-md-9
  const mainRow = element.querySelector('.col-xs-landscape-6.col-sm-6.col-md-9 > .row');
  if (mainRow) {
    const colDivs = mainRow.querySelectorAll('.col-md-4');
    colDivs.forEach(col => columns.push(col));
  }

  // Fourth column: company info and social links
  const companyCol = element.querySelector('.col-xs-landscape-6.col-sm-6.col-md-3');
  if (companyCol) {
    columns.push(companyCol);
  }

  // Fallback: If columns not found, use all direct children of .row
  if (columns.length === 0) {
    const fallbackCols = element.querySelectorAll('.row > div');
    fallbackCols.forEach(col => columns.push(col));
  }

  // Table header must match block name exactly
  const headerRow = ['Columns (columns13)'];

  // Table row: each cell is a reference to the column element (not cloned)
  const contentRow = columns.map(col => col);

  // Create the table block
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);
  element.replaceWith(table);
}
