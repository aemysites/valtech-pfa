/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns139)'];

  // Find the main content container
  const container = element.querySelector('.container-fluid');
  if (!container) {
    element.replaceWith(WebImporter.DOMUtils.createTable([headerRow], document));
    return;
  }

  // Get the main rows (the two .row elements)
  const mainRows = container.querySelectorAll(':scope > .row');
  if (mainRows.length < 2) {
    element.replaceWith(WebImporter.DOMUtils.createTable([headerRow], document));
    return;
  }

  // --- First row: Intro (heading, intro text, image) ---
  // Find the .col-sm-12 inside the first main row
  const introCol = mainRows[0].querySelector('.col-sm-12');
  let introLeftCell = document.createElement('div');
  let introRightCell = document.createElement('div');
  if (introCol) {
    // Find the inner .row
    const introInnerRow = introCol.querySelector('.row');
    if (introInnerRow) {
      const introCols = introInnerRow.querySelectorAll(':scope > div');
      // Left: heading + ALL teasers (including text nodes)
      if (introCols[0]) {
        // Heading
        const heading = introCols[0].querySelector('h2');
        if (heading) introLeftCell.appendChild(heading.cloneNode(true));
        // All teasers (h4, span, strong, text nodes)
        introCols[0].querySelectorAll('.teasers__teaser').forEach(teaser => {
          Array.from(teaser.childNodes).forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              introLeftCell.appendChild(node.cloneNode(true));
            } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
              introLeftCell.appendChild(document.createTextNode(node.textContent));
            }
          });
        });
      }
      // Right: image
      if (introCols[1]) {
        const img = introCols[1].querySelector('img');
        if (img) introRightCell.appendChild(img.cloneNode(true));
      }
    }
  }

  // --- Second row: Two columns with webinar info ---
  // The second main row contains two .col-xs-12.col-sm-6 columns
  const columnsRow = mainRows[1];
  const columns = columnsRow.querySelectorAll(':scope > div');
  let leftColCell = document.createElement('div');
  let rightColCell = document.createElement('div');
  if (columns.length >= 2) {
    // Left column: ALL teasers and links
    columns[0].querySelectorAll('.teasers__teaser').forEach(teaser => {
      Array.from(teaser.childNodes).forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          leftColCell.appendChild(node.cloneNode(true));
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          leftColCell.appendChild(document.createTextNode(node.textContent));
        }
      });
    });
    columns[0].querySelectorAll('ul.panel__links a').forEach(link => {
      leftColCell.appendChild(document.createElement('br'));
      leftColCell.appendChild(link.cloneNode(true));
    });
    // Right column: ALL teasers and links
    columns[1].querySelectorAll('.teasers__teaser').forEach(teaser => {
      Array.from(teaser.childNodes).forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          rightColCell.appendChild(node.cloneNode(true));
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          rightColCell.appendChild(document.createTextNode(node.textContent));
        }
      });
    });
    columns[1].querySelectorAll('ul.panel__links a').forEach(link => {
      rightColCell.appendChild(document.createElement('br'));
      rightColCell.appendChild(link.cloneNode(true));
    });
  }

  // Build the table rows
  const rows = [
    headerRow,
    [introLeftCell, introRightCell],
    [leftColCell, rightColCell]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Always replace the original element
  element.replaceWith(block);
}
