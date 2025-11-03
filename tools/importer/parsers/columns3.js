/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the Columns block
  const headerRow = ['Columns (columns3)'];

  // Find the main row containing the columns
  const mainRow = element.querySelector('.container-fluid > .row');
  if (!mainRow) return;

  // The left columns are inside a col-md-9, which itself has a .row with three .col-md-4
  const leftCol = mainRow.querySelector('.col-md-9');
  let col1 = null, col2 = null;
  if (leftCol) {
    const innerRow = leftCol.querySelector('.row');
    if (innerRow) {
      const innerCols = innerRow.querySelectorAll('.col-md-4');
      col1 = innerCols[0];
      col2 = innerCols[1];
    }
  }
  // The rightmost column is col-md-3
  const col3 = mainRow.querySelector('.col-md-3');

  // Column 1: Genveje
  let col1Content = [];
  if (col1) {
    const heading = col1.querySelector('.footer__heading');
    if (heading) col1Content.push(heading.cloneNode(true));
    const wrapper = col1.querySelector('.footer__wrapper');
    if (wrapper) {
      const list = wrapper.querySelector('ul');
      if (list) col1Content.push(list.cloneNode(true));
    }
  }

  // Column 2: Øvrige
  let col2Content = [];
  if (col2) {
    const heading = col2.querySelector('.footer__heading');
    if (heading) col2Content.push(heading.cloneNode(true));
    const wrapper = col2.querySelector('.footer__wrapper');
    if (wrapper) {
      const list = wrapper.querySelector('ul');
      if (list) col2Content.push(list.cloneNode(true));
    }
  }

  // Column 3: Pension for funktionærer + address + social
  let col3Content = [];
  if (col3) {
    const heading = col3.querySelector('.footer__heading');
    if (heading) col3Content.push(heading.cloneNode(true));
    const address = col3.querySelector('address');
    if (address) col3Content.push(address.cloneNode(true));
    const share = col3.querySelector('.share--footer');
    if (share) col3Content.push(share.cloneNode(true));
  }

  // Compose the table rows
  const rows = [
    headerRow,
    [col1Content, col2Content, col3Content],
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
