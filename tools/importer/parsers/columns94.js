/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children divs
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  // Defensive: Expecting two main columns
  let leftColContent = [];
  let rightColContent = [];

  // Find the left and right columns
  // Left: col-xs-12 col-sm-10
  // Right: col-xs-12 col-sm-2
  const leftCol = columns.find(div => div.classList.contains('col-sm-10'));
  const rightCol = columns.find(div => div.classList.contains('col-sm-2'));

  // --- LEFT COLUMN ---
  if (leftCol) {
    // Find teaser block
    const teaser = leftCol.querySelector('.teasers__teaser');
    if (teaser) {
      // Paragraph
      const p = teaser.querySelector('p');
      if (p) leftColContent.push(p);
      // Centered CTA
      const ctaDiv = teaser.querySelector('.text-center');
      if (ctaDiv) {
        leftColContent.push(ctaDiv);
      }
    }
  }

  // --- RIGHT COLUMN ---
  if (rightCol) {
    // Find all teasers in right column
    const teasers = rightCol.querySelectorAll('.teasers__teaser');
    // First teaser: heading, links, bold label
    if (teasers[0]) {
      rightColContent.push(teasers[0]);
    }
    // Second teaser: contact info
    if (teasers[1]) {
      rightColContent.push(teasers[1]);
    }
  }

  // Compose table
  const headerRow = ['Columns (columns94)'];
  const contentRow = [leftColContent, rightColContent];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
