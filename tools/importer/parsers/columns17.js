/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Columns (columns17)'];

  // Find the columns row
  const columnsRow = element.querySelector('.row .col-xs-12 .row') || element.querySelector('.row .row') || element.querySelector('.row');
  let colLeft = null;
  let colRight = null;
  if (columnsRow) {
    const cols = Array.from(columnsRow.children).filter(c => c.classList && (c.classList.contains('col-xs-12') || c.classList.contains('col-sm-9') || c.classList.contains('col-sm-3')));
    colLeft = cols.find(c => c.classList.contains('col-sm-9'));
    colRight = cols.find(c => c.classList.contains('col-sm-3'));
  }

  // Fallbacks if columns not found
  if (!colLeft) {
    colLeft = element.querySelector('.col-sm-9') || element.querySelector('.col-xs-12');
  }
  if (!colRight) {
    colRight = element.querySelector('.col-sm-3');
  }

  // Left column: heading + all text + all links (ensure all text is included)
  const leftContent = [];
  if (colLeft) {
    // Heading
    const heading = colLeft.querySelector('h2, h1, h3') || element.querySelector('h2, h1, h3');
    if (heading) leftContent.push(heading.cloneNode(true));
    // All paragraphs
    const paragraphs = colLeft.querySelectorAll('p');
    paragraphs.forEach(p => leftContent.push(p.cloneNode(true)));
    // List of links (ensure all links are included)
    const allUl = colLeft.querySelectorAll('ul.panel__links');
    allUl.forEach(ul => {
      leftContent.push(ul.cloneNode(true));
    });
  }

  // Right column: image + label (ensure label text is included)
  const rightContent = [];
  if (colRight) {
    const teaserDiv = colRight.querySelector('.teasers__teaser');
    if (teaserDiv) {
      // Find image
      const img = teaserDiv.querySelector('img');
      if (img) rightContent.push(img.cloneNode(true));
      // Find label (text below image)
      // Try to find label after <img>
      let label = null;
      if (img) {
        let foundLabel = false;
        let next = img.nextSibling;
        while (next) {
          if (next.nodeType === Node.TEXT_NODE && next.textContent.trim() && next.textContent.trim() !== '\u00a0') {
            label = document.createElement('div');
            label.textContent = next.textContent.trim();
            foundLabel = true;
            break;
          } else if (next.nodeType === Node.ELEMENT_NODE && next.textContent.trim()) {
            label = next.cloneNode(true);
            foundLabel = true;
            break;
          }
          next = next.nextSibling;
        }
        // If not found, try to find any text node in teaserDiv (excluding &nbsp;)
        if (!foundLabel) {
          const teaserTexts = Array.from(teaserDiv.childNodes).filter(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim() && n.textContent.trim() !== '\u00a0');
          if (teaserTexts.length) {
            label = document.createElement('div');
            label.textContent = teaserTexts.map(n => n.textContent.trim()).join(' ');
          }
        }
      }
      if (label && label.textContent) rightContent.push(label);
    }
  }

  // Ensure right column is never empty if image is present
  // If rightContent is still empty but an image exists, add the image only
  if (rightContent.length === 0 && colRight) {
    const teaserDiv = colRight.querySelector('.teasers__teaser');
    if (teaserDiv) {
      const img = teaserDiv.querySelector('img');
      if (img) rightContent.push(img.cloneNode(true));
    }
  }

  // Build table
  const cells = [
    headerRow,
    [leftContent, rightContent]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
