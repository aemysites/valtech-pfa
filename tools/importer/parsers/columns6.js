/* global WebImporter */
export default function parse(element, { document }) {
  // Table header
  const headerRow = ['Columns (columns6)'];

  // Get all immediate columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  if (columns.length < 2) return;

  // LEFT COLUMN: Gather all .teasers__teaser content as a single cell, including empty ones
  const leftCol = columns[0];
  const leftTeasers = Array.from(leftCol.querySelectorAll('.teasers__teaser'));
  const leftCellContent = document.createElement('div');
  leftTeasers.forEach(teaser => {
    leftCellContent.appendChild(teaser.cloneNode(true));
  });

  // RIGHT COLUMN: Find video embed and caption, preserve all text nodes (including &nbsp;)
  const rightCol = columns[1];
  const rightTeasers = Array.from(rightCol.querySelectorAll('.teasers__teaser'));
  const rightCellContent = document.createElement('div');
  rightTeasers.forEach(teaser => {
    // If teaser contains an iframe, replace with link (no editorial label)
    const iframe = teaser.querySelector('iframe');
    if (iframe && iframe.src) {
      const videoLink = document.createElement('a');
      videoLink.href = iframe.src;
      videoLink.textContent = '';
      videoLink.target = '_blank';
      rightCellContent.appendChild(videoLink);
      // Also check for <em> inside this teaser and append after link
      const em = teaser.querySelector('em');
      if (em) {
        rightCellContent.appendChild(em.cloneNode(true));
      }
    } else {
      // Otherwise, clone all content (including &nbsp;, <em>, etc)
      rightCellContent.appendChild(teaser.cloneNode(true));
    }
  });

  // Table content row: two columns
  const contentRow = [leftCellContent, rightCellContent];

  // Build the table
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
