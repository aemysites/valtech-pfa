/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns16)'];

  // Get all <li> elements (each contains an <a>)
  const items = Array.from(element.querySelectorAll(':scope > li'));
  // Extract all <a> elements
  const links = items.map(li => li.querySelector('a')).filter(Boolean);

  // Split links into two columns: left and right
  // Left: all 'PFA Plus' links, Right: all 'PFA Klima Plus' links
  const leftLinks = links.filter(a => a.textContent.includes('PFA Plus'));
  const rightLinks = links.filter(a => a.textContent.includes('PFA Klima Plus'));

  // Build rows: each row contains one left and one right link
  const maxRows = Math.max(leftLinks.length, rightLinks.length);
  const grid = [];
  for (let i = 0; i < maxRows; i++) {
    grid.push([
      leftLinks[i] || '',
      rightLinks[i] || ''
    ]);
  }

  const cells = [headerRow, ...grid];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
