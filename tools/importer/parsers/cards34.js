/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Cards (cards34)'];
  const rows = [headerRow];

  // Helper to extract all text content from a teaser card
  function extractTextCard(col) {
    // Find the .teasers__teaser div
    const teaser = col.querySelector('.teasers__teaser');
    if (!teaser) return ['', '']; // two columns: image/icon (empty), text
    // Find the heading (strong or span strong)
    let heading = '';
    let description = '';
    const strong = teaser.querySelector('strong');
    if (strong) {
      heading = strong.textContent.trim();
    }
    // Description: all text after the heading
    // Remove the heading node, then get the rest of the text
    const teaserClone = teaser.cloneNode(true);
    const strongClone = teaserClone.querySelector('strong');
    if (strongClone) {
      strongClone.remove();
    }
    description = teaserClone.textContent.replace(/\s+/g, ' ').trim();
    // Compose text cell
    const textCell = [];
    if (heading) {
      const h3 = document.createElement('h3');
      h3.textContent = heading;
      textCell.push(h3);
    }
    if (description) {
      textCell.push(document.createTextNode(description));
    }
    return ['', textCell]; // two columns: image/icon (empty), text
  }

  // Find all columns in this row
  const cols = Array.from(element.querySelectorAll('.col-xs-12'));
  cols.forEach(col => {
    rows.push(extractTextCard(col));
  });

  // Create and replace block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
