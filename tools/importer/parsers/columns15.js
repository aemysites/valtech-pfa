/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns15)'];

  // Defensive: Find the main container with the columns
  const container = element.querySelector('.container-fluid');
  if (!container) return;

  // Get the main row inside the container
  const mainRow = container.querySelector('.row');
  if (!mainRow) return;

  // Get all immediate children columns (should be 2: left 3/4, right 1/4)
  const colDivs = Array.from(mainRow.children);
  if (colDivs.length < 2) return;

  // Left columns (the 3 navigation columns)
  const leftColsContainer = colDivs[0];
  // Defensive: Find the inner row for the three columns
  const leftInnerRow = leftColsContainer.querySelector('.row');
  if (!leftInnerRow) return;
  const navCols = Array.from(leftInnerRow.children); // Should be 3 columns

  // Right column (company info + social)
  const rightCol = colDivs[1];

  // For each nav column, extract the heading and the list
  function extractNavCol(col) {
    // Heading (usually <p> with class 'footer__heading')
    const heading = col.querySelector('.footer__heading');
    // List (usually <ul> with class 'footer__list')
    const list = col.querySelector('.footer__list');
    // Defensive: If both exist, return them as an array
    const content = [];
    if (heading) content.push(heading);
    if (list) content.push(list);
    return content;
  }

  // For the right column, extract heading, address, and social links
  function extractRightCol(col) {
    const content = [];
    // Heading
    const heading = col.querySelector('.footer__heading');
    if (heading) content.push(heading);
    // Address
    const address = col.querySelector('address');
    if (address) content.push(address);
    // Social links (dl.share)
    const share = col.querySelector('.share--footer');
    if (share) content.push(share);
    return content;
  }

  // Compose the columns for the second row
  const rowCells = [
    extractNavCol(navCols[0]),
    extractNavCol(navCols[1]),
    extractNavCol(navCols[2]),
    extractRightCol(rightCol)
  ];

  // Compose the table data
  const tableData = [
    headerRow,
    rowCells
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element
  element.replaceWith(block);
}
