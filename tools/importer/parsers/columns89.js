/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns89)'];

  // Get immediate children columns
  const columns = element.querySelectorAll(':scope > div');
  const contentRow = [];

  // Left column: .col-xs-12.col-sm-8
  const leftCol = Array.from(columns).find(col => col.classList.contains('col-sm-8'));
  if (leftCol) {
    // Gather all teaser divs (including empty ones) and heading, in DOM order
    // Find all direct children of leftCol in order
    const leftContent = document.createElement('div');
    Array.from(leftCol.children).forEach(child => {
      // If teaser div (including empty ones)
      if (child.classList.contains('teasers__teaser')) {
        leftContent.appendChild(child);
      }
      // If heading (h4.teasers__teaser)
      else if (child.tagName === 'H4' && child.classList.contains('teasers__teaser')) {
        leftContent.appendChild(child);
      }
      // If cta wrapper (div.col-xs-12.text-center)
      else if (child.classList.contains('col-xs-12') && child.classList.contains('text-center')) {
        // Add the whole wrapper (preserves button structure)
        leftContent.appendChild(child);
      }
    });
    contentRow.push(leftContent);
  }

  // Right column: .col-xs-12.col-sm-4
  const rightCol = Array.from(columns).find(col => col.classList.contains('col-sm-4'));
  if (rightCol) {
    // Find image inside teaser
    const imgTeaser = rightCol.querySelector('.teasers__teaser img');
    if (imgTeaser) {
      contentRow.push(imgTeaser);
    }
  }

  // Create table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
