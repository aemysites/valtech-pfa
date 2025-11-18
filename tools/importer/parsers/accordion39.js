/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion (accordion39) block parsing
  // Ensure ALL visible text content from the original HTML is included in ANY cell
  const headerRow = ['Accordion (accordion39)'];
  const rows = [headerRow];

  // Gather all intro content before the first .accordions__toggler
  let node = element.firstElementChild;
  const introNodes = [];
  while (node && !node.classList.contains('accordions__toggler')) {
    // Include headings and paragraphs with text
    if ((/^H[1-6]$/).test(node.tagName) || node.tagName === 'P') {
      if (node.textContent.trim()) {
        introNodes.push(node.cloneNode(true));
      }
    }
    node = node.nextElementSibling;
  }
  // If any introNodes, add as a single cell before the accordion items
  if (introNodes.length) {
    rows.push([introNodes, '']);
  }

  // Now, get all toggler and element pairs in DOM order
  let curr = element.firstElementChild;
  while (curr) {
    if (curr.classList && curr.classList.contains('accordions__toggler')) {
      const title = curr.cloneNode(true);
      // Find the next .accordions__element sibling
      let contentNode = curr.nextElementSibling;
      while (contentNode && !(contentNode.classList && contentNode.classList.contains('accordions__element'))) {
        contentNode = contentNode.nextElementSibling;
      }
      let content = '';
      if (contentNode) {
        // Gather all content including images, paragraphs, links, etc.
        const contentParts = [];
        Array.from(contentNode.childNodes).forEach(child => {
          if (child.nodeType === 1 && (child.tagName === 'P' || child.tagName === 'IMG' || (/^H[1-6]$/).test(child.tagName))) {
            contentParts.push(child.cloneNode(true));
          } else if (child.nodeType === 3 && child.textContent.trim()) {
            // Text node
            const span = document.createElement('span');
            span.textContent = child.textContent;
            contentParts.push(span);
          }
        });
        // If nothing found, fallback to clone
        content = contentParts.length ? contentParts : contentNode.cloneNode(true);
      }
      rows.push([title, content]);
      curr = contentNode;
    }
    curr = curr ? curr.nextElementSibling : null;
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
