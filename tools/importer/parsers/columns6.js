/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main row containing all columns
  const mainRow = element.querySelector('.container-fluid > .row');
  if (!mainRow) return;

  // Find the three left columns (accordion lists)
  const leftCols = mainRow.querySelectorAll('.col-md-4');
  // Find the right column (company info)
  const rightCol = mainRow.querySelector('.col-md-3');

  // Prepare columns array
  const columns = [];

  // Parse each left column
  leftCols.forEach(col => {
    const colContent = [];
    // Heading
    const heading = col.querySelector('p.footer__heading');
    if (heading) colContent.push(heading);
    // List of links
    const wrapper = col.querySelector('.footer__wrapper');
    if (wrapper) {
      const list = wrapper.querySelector('ul');
      if (list) colContent.push(list);
    }
    columns.push(colContent);
  });

  // Parse right column
  if (rightCol) {
    const colContent = [];
    // Heading
    const heading = rightCol.querySelector('p.footer__heading');
    if (heading) colContent.push(heading);
    // Address
    const address = rightCol.querySelector('address');
    if (address) colContent.push(address);
    // Social links
    const share = rightCol.querySelector('.share--footer');
    if (share) colContent.push(share);
    columns.push(colContent);
  }

  // Build table rows
  const headerRow = ['Columns (columns6)'];
  // Each cell in the next row is an array of elements for that column
  const row = columns.map(colArr => {
    const cell = document.createElement('div');
    colArr.forEach(el => cell.appendChild(el));
    return cell;
  });
  const tableRows = [headerRow, row];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
