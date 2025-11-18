/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns29)'];

  // Defensive: get the main row containing the two columns
  const mainRow = element.querySelector('.row.teasers .row');
  if (!mainRow) return;

  // Get the two columns
  const leftCol = mainRow.querySelector('.col-sm-8');
  const rightCol = mainRow.querySelector('.col-sm-4');

  // Defensive: fallback if columns not found
  if (!leftCol || !rightCol) return;

  // Left column: get the teaser block (contains heading, paragraph, CTA)
  const teaser = leftCol.querySelector('.teasers__teaser');
  // Defensive: fallback to leftCol if teaser not found
  const leftContent = teaser || leftCol;

  // Right column: get the image (should be only one)
  const img = rightCol.querySelector('img');
  // Defensive: fallback to rightCol if image not found
  const rightContent = img ? img : rightCol;

  // Compose the table rows
  const cells = [
    headerRow,
    [leftContent, rightContent]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
