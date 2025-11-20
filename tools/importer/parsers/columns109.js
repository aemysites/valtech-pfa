/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns109)'];

  // Defensive: Get immediate children representing columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Left column: find the image (first col)
  let leftContent = null;
  if (columns[0]) {
    const img = columns[0].querySelector('img');
    if (img) {
      leftContent = img;
    } else {
      leftContent = columns[0]; // fallback: whole column
    }
  }

  // Right column: all text and links (second col)
  let rightContent = document.createElement('div');
  if (columns[1]) {
    const teaser = columns[1].querySelector('.teasers__teaser') || columns[1];
    // Heading/subheading
    const strong = teaser.querySelector('strong');
    if (strong) rightContent.appendChild(strong);
    const h3 = teaser.querySelector('h3');
    if (h3 && h3.textContent.trim()) rightContent.appendChild(h3);
    const p = teaser.querySelector('p');
    if (p) rightContent.appendChild(p);
    // Links: preserve <ul>/<li> structure
    const linksList = teaser.querySelector('ul.panel__links');
    if (linksList) {
      // Only include non-empty list items with links
      const ul = document.createElement('ul');
      Array.from(linksList.querySelectorAll('li')).forEach(li => {
        const a = li.querySelector('a');
        if (a && a.textContent.trim()) {
          const liEl = document.createElement('li');
          liEl.appendChild(a);
          ul.appendChild(liEl);
        }
      });
      if (ul.childNodes.length) rightContent.appendChild(ul);
    }
  }

  // Build the table rows
  const rows = [
    headerRow,
    [leftContent, rightContent]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
