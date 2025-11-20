/* global WebImporter */
export default function parse(element, { document }) {
  // Get all direct children columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  if (columns.length < 2) return;

  // Header row: must match block name exactly
  const headerRow = ['Columns (columns86)'];

  // Left column: main text (heading + paragraph)
  let leftContent = document.createElement('div');
  {
    const leftCol = columns.find(col => col.classList.contains('col-sm-10')) || columns[0];
    const teaser = leftCol.querySelector('.teasers__teaser') || leftCol;
    const heading = teaser.querySelector('h5');
    const paragraph = teaser.querySelector('p');
    if (heading) leftContent.appendChild(heading);
    if (paragraph) leftContent.appendChild(paragraph);
  }

  // Right column: image
  let rightContent = document.createElement('div');
  {
    const rightCol = columns.find(col => col.classList.contains('col-sm-2')) || columns[1];
    const img = rightCol.querySelector('img');
    if (img) rightContent.appendChild(img);
  }

  // Table rows
  const tableRows = [
    headerRow,
    [leftContent, rightContent]
  ];
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace original element
  element.replaceWith(block);
}
