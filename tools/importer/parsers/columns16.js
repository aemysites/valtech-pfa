/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns16)'];

  // Find all <ul.panel__links> inside the element (not just immediate children)
  const lists = Array.from(element.querySelectorAll('ul.panel__links'));

  // If there are no lists, do nothing
  if (!lists.length) return;

  // Each <ul> becomes a column cell (clone to avoid moving original nodes)
  const columnsRow = lists.map((ul) => ul.cloneNode(true));

  // Table: first row is header, second row is columns
  const tableCells = [headerRow, columnsRow];

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace the original element with the block table
  if (element.parentNode) {
    element.parentNode.replaceChild(blockTable, element);
  }
}
