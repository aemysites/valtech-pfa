/* global WebImporter */
export default function parse(element, { document }) {
  // Always start with the required header row
  const headerRow = ['Columns (columns130)'];

  // Defensive: Get all immediate li children (tabs) from the ul
  const tabItems = Array.from(element.querySelectorAll(':scope > li'));

  // If no li found, fallback to all li inside element
  const fallbackTabItems = tabItems.length ? tabItems : Array.from(element.querySelectorAll('li'));

  // Each tab becomes a column (cell)
  const columnsRow = fallbackTabItems.map((li) => {
    // Defensive: If li contains an anchor, use its content
    const anchor = li.querySelector('a');
    if (anchor) {
      // Create a div to wrap the anchor's content (preserve formatting)
      const div = document.createElement('div');
      // Use innerHTML to preserve line breaks and formatting
      div.innerHTML = anchor.innerHTML.trim();
      return div;
    } else {
      // Fallback: use li's text content
      return document.createTextNode(li.textContent.trim());
    }
  });

  // Build the table data
  const cells = [headerRow, columnsRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}
