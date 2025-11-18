/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get immediate children columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Defensive: Expecting two main columns (left: text+cta, right: image)
  let leftCol, rightCol;
  if (columns.length === 2) {
    // Find which is wider (sm-9 vs sm-3)
    leftCol = columns.find(col => col.classList.contains('col-sm-9'));
    rightCol = columns.find(col => col.classList.contains('col-sm-3'));
  } else {
    // Fallback: Use first as left, second as right
    [leftCol, rightCol] = columns;
  }

  // Left column: extract all paragraphs and CTA
  let leftContent = [];
  if (leftCol) {
    // The actual content is inside .teasers__teaser
    const teaser = leftCol.querySelector('.teasers__teaser') || leftCol;
    // Get all paragraphs
    leftContent = Array.from(teaser.querySelectorAll('p'));
    // Find CTA (button or link)
    const ctaWrapper = teaser.querySelector('.col-xs-12.text-left');
    if (ctaWrapper) {
      const cta = ctaWrapper.querySelector('a');
      if (cta) leftContent.push(cta);
    }
  }

  // Right column: extract image
  let rightContent = [];
  if (rightCol) {
    const img = rightCol.querySelector('img');
    if (img) rightContent.push(img);
  }

  // Table structure
  const headerRow = ['Columns (columns42)'];
  const contentRow = [leftContent, rightContent];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
