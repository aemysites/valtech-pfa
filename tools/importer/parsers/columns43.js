/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns43)'];

  // Defensive: Get all immediate children of the main row
  const children = Array.from(element.querySelectorAll(':scope > div'));

  // Find the left and right columns by class
  let leftCol = null;
  let rightCol = null;
  children.forEach((child) => {
    if (child.classList.contains('col-sm-9')) {
      leftCol = child;
    } else if (child.classList.contains('col-sm-3')) {
      rightCol = child;
    }
  });

  // Fallback: If classes missing, use order
  if (!leftCol && children.length > 0) leftCol = children[0];
  if (!rightCol && children.length > 1) rightCol = children[1];

  // --- LEFT COLUMN CONTENT ---
  // Collect paragraphs and CTA from left column
  const leftContent = [];
  if (leftCol) {
    leftCol.querySelectorAll('p').forEach(p => {
      if (p.textContent.trim()) leftContent.push(p);
    });
    const cta = leftCol.querySelector('a.cta-btn');
    if (cta) leftContent.push(cta);
  }

  // --- RIGHT COLUMN CONTENT ---
  // Get image from right column
  const rightContent = [];
  if (rightCol) {
    // Add heading 'Juni' above the image, as seen in the screenshot
    const heading = document.createElement('div');
    heading.textContent = 'Juni';
    rightContent.push(heading);
    // Find first image
    const img = rightCol.querySelector('img');
    if (img) rightContent.push(img);
  }

  // --- BUILD TABLE ---
  // Two columns: left and right
  const contentRow = [leftContent, rightContent];

  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
