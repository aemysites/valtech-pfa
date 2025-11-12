/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards34) block parsing
  // 1. Header row
  const headerRow = ['Cards (cards34)'];

  // 2. Find all .row elements (each is a card row)
  const rowNodes = Array.from(element.querySelectorAll('.row'));

  // 3. Build rows for each card
  const rows = rowNodes.map(row => {
    // Image/Icon (first cell)
    // Use the FIRST image found in left or right columns
    let imgCell = '';
    const leftImg = row.querySelector('.col-xs-12.col-sm-1 img');
    if (leftImg) {
      imgCell = leftImg.cloneNode(true);
    } else {
      // fallback: try right column
      const rightImg = row.querySelector('.col-xs-12.col-sm-1:last-child img');
      if (rightImg) imgCell = rightImg.cloneNode(true);
    }

    // Text Content (second cell)
    // Get all content from the center column
    let textCell = '';
    const centerCol = row.querySelector('.col-xs-12.col-sm-10 .teasers__teaser');
    if (centerCol) {
      // Collect all elements (h3, p, span, etc) and any text nodes
      const content = [];
      Array.from(centerCol.childNodes).forEach(node => {
        if (node.nodeType === 1) {
          content.push(node.cloneNode(true));
        } else if (node.nodeType === 3 && node.textContent.trim()) {
          content.push(document.createTextNode(node.textContent.trim()));
        }
      });
      // Ensure we include all text content, even if not wrapped in elements
      if (content.length) {
        textCell = content;
      } else {
        const txt = centerCol.textContent.trim();
        if (txt) textCell = txt;
      }
    }

    // Always add card row if there is any text content (even if no image)
    if ((Array.isArray(textCell) ? textCell.length : textCell)) {
      return [imgCell, textCell];
    }
    return null;
  }).filter(Boolean);

  // 4. Compose table data
  const cells = [headerRow, ...rows];

  // 5. Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // 6. Replace original element
  element.replaceWith(block);
}
