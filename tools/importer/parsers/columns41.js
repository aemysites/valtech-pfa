/* global WebImporter */
export default function parse(element, { document }) {
  // Find the visible heading
  let heading = Array.from(element.querySelectorAll('h2')).find(h => h.offsetParent !== null || h.style.display !== 'none');
  if (!heading) heading = element.querySelector('h2');

  // Get all column containers (three columns)
  const columnDivs = Array.from(
    element.querySelectorAll('.row.teasers > .col-sm-12 > .col-xs-12.col-sm-4, .row.teasers > .col-xs-12.col-sm-4')
  );

  // For each column, reference the teaser content
  const columns = columnDivs.map(col => {
    const teaser = col.querySelector('.teasers__teaser');
    return teaser || col;
  });

  // Table header row
  const headerRow = ['Columns (columns41)'];

  // Table content: heading row, then columns row
  const tableRows = [
    headerRow,
    [heading],
    columns
  ];

  // Create the table
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(table);
}
