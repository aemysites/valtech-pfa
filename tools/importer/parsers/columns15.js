/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main row containing columns
  const row = element.querySelector(':scope > div.row');
  if (!row) return;
  // Find all direct column divs (col-xs-12 col-sm-6)
  const columns = Array.from(row.children).filter(child => child.matches('div'));
  if (columns.length < 2) return; // Must have at least two columns for columns block

  // For each column, extract all .teasers__teaser blocks (accordion groups)
  function extractColumnContent(colDiv) {
    // Only direct children .teasers__teaser
    const teasers = Array.from(colDiv.children).filter(child => child.classList.contains('teasers__teaser'));
    // Defensive: skip empty columns
    if (!teasers.length) return document.createTextNode('');
    // Wrap all teasers in a fragment
    const frag = document.createDocumentFragment();
    teasers.forEach(teaser => frag.appendChild(teaser.cloneNode(true)));
    return frag;
  }

  // Compose the table rows
  const headerRow = ['Columns (columns15)'];
  const contentRow = columns.map(colDiv => extractColumnContent(colDiv));
  const rows = [headerRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
