/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as required
  const headerRow = ['Search (search64)'];

  // Find the query index URL in the source HTML
  // The correct URL is not present in the HTML, but per block description/example, we must use the sample URL
  const queryIndexUrl = 'https://main--helix-block-collection--adobe.hlx.page/block-collection/sample-search-data/query-index.json';

  // Second row contains only the query index URL
  const contentRow = [queryIndexUrl];

  const cells = [headerRow, contentRow];
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
