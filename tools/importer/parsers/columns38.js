/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns38)'];

  // Get all immediate child columns
  const columns = Array.from(element.querySelectorAll(':scope > div.col-xs-12'));

  // For each column, extract only the relevant content (heading, text, link)
  const cells = columns.map(col => {
    const teaser = col.querySelector('.teasers__teaser');
    if (!teaser) return '';
    // Extract heading
    const heading = teaser.querySelector('h3');
    // Extract all non-empty paragraphs (ignore those with only &nbsp;)
    const paragraphs = Array.from(teaser.querySelectorAll('p'))
      .filter(p => p.textContent.trim().replace(/\u00a0/g, '').length > 0);
    // Extract link list
    const links = teaser.querySelector('ul.panel__links');
    // Compose cell content
    const fragment = document.createElement('div');
    if (heading) fragment.appendChild(heading.cloneNode(true));
    paragraphs.forEach(p => fragment.appendChild(p.cloneNode(true)));
    if (links) fragment.appendChild(links.cloneNode(true));
    return fragment;
  });

  // Build the table rows: header + one row with all columns
  const tableRows = [headerRow, cells];

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the block table
  element.replaceWith(blockTable);
}
