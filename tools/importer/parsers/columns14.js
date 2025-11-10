/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Columns block
  const headerRow = ['Columns (columns14)'];

  // Defensive: Get direct children that are columns
  const columns = Array.from(element.querySelectorAll(':scope .row.teasers > .col-sm-12 > .col-sm-6'));

  // If not found, fallback to any immediate .col-sm-6 children
  if (columns.length === 0) {
    columns.push(...element.querySelectorAll(':scope > .col-sm-6'));
  }

  // Left column: text content (heading, list, paragraph)
  let leftContent = null;
  if (columns[0]) {
    leftContent = document.createElement('div');
    Array.from(columns[0].children).forEach(child => {
      leftContent.appendChild(child);
    });
  }

  // Right column: video embed (convert iframe to link)
  let rightContent = null;
  if (columns[1]) {
    const iframeWrapper = columns[1].querySelector('div');
    if (iframeWrapper) {
      const iframe = iframeWrapper.querySelector('iframe');
      if (iframe) {
        // Replace iframe with a link to its src
        const videoLink = document.createElement('a');
        videoLink.href = iframe.src;
        videoLink.textContent = iframe.src;
        rightContent = videoLink;
      } else {
        rightContent = iframeWrapper;
      }
    } else {
      rightContent = columns[1];
    }
  }

  // Compose table rows
  const rows = [
    headerRow,
    [leftContent, rightContent]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element with the block table
  element.replaceWith(block);
}
