/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract a column's heading and content
  function extractColumn(col) {
    const parts = [];
    // Heading (if present)
    const heading = col.querySelector('.footer__heading');
    if (heading) parts.push(heading);
    // Accordion content (ul list)
    const wrapper = col.querySelector('.footer__wrapper');
    if (wrapper) {
      const list = wrapper.querySelector('ul');
      if (list) parts.push(list);
    }
    // For the last column (no accordion)
    // Address and social links
    const address = col.querySelector('address');
    if (address) parts.push(address);
    // Social icons (as links)
    const share = col.querySelector('.share--footer');
    if (share) {
      // Only include the links, not the dd wrappers
      const links = Array.from(share.querySelectorAll('a'));
      if (links.length) {
        const iconsDiv = document.createElement('div');
        links.forEach((a) => iconsDiv.appendChild(a));
        parts.push(iconsDiv);
      }
    }
    return parts;
  }

  // Get the four columns from the source HTML
  // The first row contains three columns (col-md-4), the last row is col-md-3
  const mainRow = element.querySelector('.row');
  const colGroups = Array.from(mainRow.children);

  // Defensive: if the first col is a wrapper, go one level deeper
  let leftCols = [];
  let rightCol = null;
  if (colGroups.length === 2) {
    // left: 9 cols, right: 3 cols
    const leftRow = colGroups[0].querySelector('.row');
    leftCols = leftRow ? Array.from(leftRow.children) : [];
    rightCol = colGroups[1];
  } else {
    // fallback: treat all as columns
    leftCols = colGroups;
  }

  // Compose the columns array
  const columns = [
    ...leftCols.map(extractColumn),
    rightCol ? extractColumn(rightCol) : []
  ];

  // Each column is an array of elements; we want each cell to be a column
  // The second row should have one cell per column, each cell containing the column's content
  const headerRow = ['Columns (columns13)'];
  const contentRow = columns.map((parts) => parts);

  // Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
