/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: always block name
  const headerRow = ['Columns (columns4)'];

  // Defensive: get the main row containing the two columns
  const mainRow = element.querySelector('.row.teasers .row');
  if (!mainRow) return;

  // Get the two columns
  const columns = mainRow.querySelectorAll(':scope > div');
  if (columns.length < 2) return;

  // Left column: video iframe (convert to link)
  const leftCol = columns[0];
  const videoIframe = leftCol.querySelector('iframe');
  let leftCellContent = [];
  if (videoIframe && videoIframe.src) {
    const a = document.createElement('a');
    a.href = videoIframe.src;
    a.textContent = 'Video';
    leftCellContent.push(a);
  }

  // Right column: heading + paragraphs
  const rightCol = columns[1];
  const heading = rightCol.querySelector('h2');
  const paragraphs = Array.from(rightCol.querySelectorAll('p')).filter(p => p.textContent.trim() !== '');
  let rightCellContent = [];
  if (heading) rightCellContent.push(heading);
  rightCellContent = rightCellContent.concat(paragraphs);

  // Build table rows
  const rows = [
    headerRow,
    [leftCellContent, rightCellContent]
  ];

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
