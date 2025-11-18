/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns14)'];

  // Find the two columns in the source HTML
  const row = element.querySelector('.row.teasers');
  let leftCol, rightCol;
  if (row) {
    const cols = row.querySelectorAll('.col-sm-6');
    leftCol = cols[0];
    rightCol = cols[1];
  }

  // Defensive fallback: if columns not found, treat as single column
  if (!leftCol && !rightCol) {
    leftCol = element;
  }

  // --- LEFT COLUMN: Textual content ---
  let leftContent = '';
  if (leftCol) {
    // Collect heading, list, and paragraph
    const heading = leftCol.querySelector('h2');
    const ul = leftCol.querySelector('ul');
    const p = leftCol.querySelector('p');
    // Compose content, preserving semantic structure
    if (heading) leftContent += heading.outerHTML;
    if (ul) leftContent += ul.outerHTML;
    if (p) leftContent += p.outerHTML;
  }

  // --- RIGHT COLUMN: Video embed as link ---
  let rightContent = '';
  if (rightCol) {
    const iframe = rightCol.querySelector('iframe');
    if (iframe) {
      // Replace iframe with a link to its src
      const a = document.createElement('a');
      a.href = iframe.src;
      a.textContent = 'Video Link';
      rightContent = a;
    }
  }

  // Compose the content row
  const contentRow = [
    (() => {
      const div = document.createElement('div');
      div.innerHTML = leftContent;
      return div;
    })(),
    rightContent || document.createElement('div')
  ];

  // Compose table rows
  const cells = [headerRow, contentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
