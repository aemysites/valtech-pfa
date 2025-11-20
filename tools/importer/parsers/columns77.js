/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns77)'];

  // Find the repeating column elements: each .icon-and-text__link is a column
  const iconAndText = element.querySelector('.icon-and-text--white');
  if (!iconAndText) return;

  // Each child anchor is a column
  const columns = Array.from(iconAndText.querySelectorAll(':scope > a.icon-and-text__link'));
  if (columns.length === 0) return;

  // For each column, collect the image and text
  const contentRow = columns.map((col) => {
    // Reference the actual <img> element (do not clone)
    const imgEl = col.querySelector('.icon-and-text__image img');
    // Reference the actual text element (do not clone)
    const textEl = col.querySelector('.icon-and-text__text');
    // Compose cell: image above text, both in a vertical stack
    const cell = document.createElement('div');
    if (imgEl) cell.appendChild(imgEl);
    if (textEl) cell.appendChild(textEl);
    // Wrap the cell in the original anchor to preserve link
    const link = document.createElement('a');
    link.href = col.getAttribute('href');
    link.appendChild(cell);
    return link;
  });

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
