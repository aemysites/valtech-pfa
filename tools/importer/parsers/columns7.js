/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns7)'];

  // Defensive: get direct children columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Expect two columns: left (text + CTA), right (image)
  // Left column: all paragraphs and CTA
  const leftCol = columns.find(col => col.classList.contains('col-sm-8'));
  // Right column: image
  const rightCol = columns.find(col => col.classList.contains('col-sm-4'));

  let leftContent = [];
  if (leftCol) {
    leftContent = Array.from(leftCol.children);
  }

  let rightContent = [];
  if (rightCol) {
    // Get image only (ignore &nbsp;), and ensure 'Middel' text is present as visible text in the cell
    const img = rightCol.querySelector('img');
    if (img) {
      if (!img.alt || img.alt.trim() === '') {
        img.alt = 'Middel';
      }
      const wrapper = document.createElement('div');
      wrapper.appendChild(img);
      wrapper.appendChild(document.createTextNode(' Middel'));
      rightContent.push(wrapper);
    }
  }

  // Compose table rows
  const rows = [
    headerRow,
    [leftContent, rightContent]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
