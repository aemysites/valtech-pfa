/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row for Columns block
  const headerRow = ['Columns (columns30)'];

  // Find all direct child columns (left and right)
  const columns = element.querySelectorAll(':scope > div');

  // Defensive: fallback if structure changes
  if (columns.length < 2) {
    const block = WebImporter.DOMUtils.createTable([headerRow], document);
    element.replaceWith(block);
    return;
  }

  // LEFT COLUMN: Only include the teaser content ONCE (no duplicate heading)
  const leftCol = columns[0];
  let leftCellContent = [];
  const teaser = leftCol.querySelector('.teasers__teaser');
  if (teaser) {
    leftCellContent.push(teaser.cloneNode(true));
  }
  // Also include the paragraph with 'Læs mere' if present
  const teaserPara = leftCol.querySelector('p.teasers__teaser');
  if (teaserPara && teaserPara !== teaser) {
    leftCellContent.push(teaserPara.cloneNode(true));
  }
  // Also include any direct text nodes not inside those selectors
  leftCol.childNodes.forEach((node) => {
    if (node.nodeType === 3 && node.textContent.trim()) {
      const span = document.createElement('span');
      span.textContent = node.textContent.trim();
      leftCellContent.push(span);
    }
  });

  // RIGHT COLUMN: Convert iframe to link, include podcast image if present
  const rightCol = columns[1];
  let rightCellContent = [];
  // Convert iframe to link
  const iframe = rightCol.querySelector('iframe');
  if (iframe && iframe.src) {
    const link = document.createElement('a');
    link.href = iframe.src;
    link.textContent = 'Lyt til podcasten';
    rightCellContent.push(link);
  }
  // Include podcast cover image if present (from right column only)
  const img = rightCol.querySelector('img');
  if (img) {
    rightCellContent.push(img.cloneNode(true));
  }
  // Also include any direct text nodes not inside those selectors
  rightCol.childNodes.forEach((node) => {
    if (node.nodeType === 3 && node.textContent.trim()) {
      const span = document.createElement('span');
      span.textContent = node.textContent.trim();
      rightCellContent.push(span);
    }
  });

  // Compose table rows
  const rows = [
    headerRow,
    [leftCellContent, rightCellContent]
  ];

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
