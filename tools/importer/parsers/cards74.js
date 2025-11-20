/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards74) block: 2 columns, multiple rows, first row is header
  const headerRow = ['Cards (cards74)'];
  const rows = [headerRow];

  // Find all card columns (each card)
  const cardElements = element.querySelectorAll('.col-xs-12.col-sm-4');

  cardElements.forEach((card) => {
    // --- First column: Image ---
    const img = card.querySelector('img');
    if (!img) return;

    // --- Second column: Text content ---
    // Get all content except image
    // Start after image and <br><br>
    let textContentNodes = [];
    let node = img;
    // Advance to first <br> after img
    while (node && (node.nodeType !== Node.ELEMENT_NODE || node.tagName !== 'BR')) {
      node = node.nextSibling;
    }
    // Skip all consecutive <br>s
    while (node && node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BR') {
      node = node.nextSibling;
    }
    // Now collect all nodes until the links list (ul.panel__links)
    const stopNode = card.querySelector('.panel__links');
    while (node && node !== stopNode) {
      textContentNodes.push(node);
      node = node.nextSibling;
    }
    // Remove empty text nodes
    textContentNodes = textContentNodes.filter(n => {
      if (!n) return false;
      if (n.nodeType === Node.TEXT_NODE) return n.textContent.trim().length > 0;
      return true;
    });

    // Get CTA link
    let cta = null;
    const links = card.querySelectorAll('a');
    for (const link of links) {
      if (link.textContent && link.textContent.trim().toLowerCase().includes('læs artiklen')) {
        cta = link;
        break;
      }
    }

    // Compose text cell
    const cellContent = [...textContentNodes];
    if (cta) cellContent.push(cta);

    rows.push([img, cellContent]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
