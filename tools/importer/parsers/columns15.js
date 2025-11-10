/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns15)'];

  // Defensive: Find the main row containing the four columns
  const mainRow = element.querySelector('.container-fluid > .row');
  if (!mainRow) return;

  // Get the four columns (three link columns, one contact column)
  // The first child is a row with three columns, the second is the contact/social column
  const leftColsContainer = mainRow.querySelector('.col-md-9 > .row');
  const leftCols = leftColsContainer ? Array.from(leftColsContainer.children) : [];
  const rightCol = mainRow.querySelector('.col-md-3');

  // Defensive: Ensure we have all four columns
  if (leftCols.length !== 3 || !rightCol) return;

  // Build the cells for each column
  // Column 1: PFA
  const col1Heading = leftCols[0].querySelector('.footer__heading');
  const col1List = leftCols[0].querySelector('.footer__list');
  const col1Content = [];
  if (col1Heading) col1Content.push(col1Heading);
  if (col1List) col1Content.push(col1List);

  // Column 2: Genveje
  const col2Heading = leftCols[1].querySelector('.footer__heading');
  const col2List = leftCols[1].querySelector('.footer__list');
  const col2Content = [];
  if (col2Heading) col2Content.push(col2Heading);
  if (col2List) col2Content.push(col2List);

  // Column 3: Øvrige
  const col3Heading = leftCols[2].querySelector('.footer__heading');
  const col3List = leftCols[2].querySelector('.footer__list');
  const col3Content = [];
  if (col3Heading) col3Content.push(col3Heading);
  if (col3List) col3Content.push(col3List);

  // Column 4: Company info and social
  const col4Heading = rightCol.querySelector('.footer__heading');
  const col4Address = rightCol.querySelector('address');
  const col4Share = rightCol.querySelector('.share--footer');
  const col4Content = [];
  if (col4Heading) col4Content.push(col4Heading);
  if (col4Address) col4Content.push(col4Address);
  if (col4Share) col4Content.push(col4Share);

  // Build the table rows
  const contentRow = [col1Content, col2Content, col3Content, col4Content];

  const rows = [headerRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
