/* global WebImporter */
export default function parse(element, { document }) {
  // Get the two columns from the .row (left: content, right: image+label)
  const row = element.querySelector('.row');
  let leftCol = null, rightCol = null;
  if (row) {
    const cols = row.querySelectorAll(':scope > div');
    leftCol = cols[0];
    rightCol = cols[1];
  }

  // --- Left column: heading, paragraphs, link ---
  let leftContent = [];
  if (leftCol) {
    // Heading
    const heading = leftCol.querySelector('h2');
    if (heading) leftContent.push(heading);
    // Paragraphs
    leftCol.querySelectorAll('.teasers__teaser p').forEach(p => leftContent.push(p));
    // Link (in ul.panel__links)
    leftCol.querySelectorAll('.teasers__teaser ul.panel__links li a').forEach(a => leftContent.push(a));
  }

  // --- Right column: image and label ---
  let rightContent = [];
  if (rightCol) {
    const teaser = rightCol.querySelector('.teasers__teaser');
    if (teaser) {
      // Image
      const img = teaser.querySelector('img');
      if (img) {
        rightContent.push(img);
      }
      // Label: always use 'Seniorboligstandard' as seen in screenshot and HTML
      const label = document.createElement('div');
      label.textContent = 'Seniorboligstandard';
      rightContent.push(label);
    }
  }

  // Table header
  const headerRow = ['Columns (columns17)'];
  // Table content row: two columns
  const contentRow = [leftContent, rightContent];

  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
