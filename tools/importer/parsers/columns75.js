/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns75)'];

  // Get the immediate column divs
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Defensive: Expecting two columns
  if (columns.length < 2) return;

  // --- LEFT COLUMN ---
  const leftCol = columns[0];
  // Find image and caption
  const img = leftCol.querySelector('img');
  const caption = leftCol.querySelector('span, figcaption');
  // Compose left column cell
  const leftCellContent = [];
  if (img) leftCellContent.push(img);
  if (caption) leftCellContent.push(caption);

  // --- RIGHT COLUMN ---
  const rightCol = columns[1];
  // Heading
  const heading = rightCol.querySelector('h2, h1, h3');
  // Paragraphs
  const paragraphs = Array.from(rightCol.querySelectorAll('p'));
  // CTA Button (anchor)
  const cta = rightCol.querySelector('a.cta-btn, a[href], button');
  // Compose right column cell
  const rightCellContent = [];
  if (heading) rightCellContent.push(heading);
  if (paragraphs.length) rightCellContent.push(...paragraphs);
  if (cta) rightCellContent.push(cta);

  // Build the table rows
  const rows = [
    headerRow,
    [leftCellContent, rightCellContent]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
