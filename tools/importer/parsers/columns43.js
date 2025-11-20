/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns43)'];

  // Get all immediate children of the main row
  const children = Array.from(element.querySelectorAll(':scope > div'));

  // Find the left column (text and CTA)
  let leftCol = children.find(div => div.classList.contains('col-sm-9'));
  // Find the right column (image)
  let rightCol = children.find(div => div.classList.contains('col-sm-3'));

  // Defensive fallback if not found
  if (!leftCol) leftCol = children[0];
  if (!rightCol) rightCol = children[1];

  // Left column: collect all non-empty paragraphs and the CTA button
  const leftContent = [];
  leftCol.querySelectorAll('p').forEach(p => {
    if (p.textContent.trim()) leftContent.push(p);
  });
  // Find the CTA button (anchor only, not the wrapper div)
  const cta = leftCol.querySelector('.cta-btn');
  if (cta) {
    leftContent.push(cta);
  }

  // Right column: add 'Juni' heading as a heading element and the image
  const rightContent = [];
  // Add the heading 'Juni' above the image as an <h3>
  const juniHeading = document.createElement('h3');
  juniHeading.textContent = 'Juni';
  juniHeading.style.textAlign = 'center';
  rightContent.push(juniHeading);
  // Add the image
  const img = rightCol.querySelector('img');
  if (img) {
    rightContent.push(img);
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
