/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion9)'];

  // Find all direct children in the main content column
  const mainCol = element.querySelector('.col-sm-12');
  if (!mainCol) return;

  // Get all children of the main column
  const children = Array.from(mainCol.childNodes);

  // Find all toggler paragraphs and their corresponding content blocks
  const accordionRows = [];
  for (let i = 0; i < children.length; i++) {
    const node = children[i];
    // Find toggler
    if (node.nodeType === 1 && node.classList.contains('accordions__toggler')) {
      // Title cell: extract text content only
      const titleText = node.textContent.trim();
      // Next element should be the content block
      let contentCell = null;
      for (let j = i + 1; j < children.length; j++) {
        const nextNode = children[j];
        if (nextNode.nodeType === 1 && nextNode.classList.contains('accordions__element')) {
          // Get all content inside the accordion element
          const contentParts = [];
          nextNode.childNodes.forEach((el) => {
            if (el.nodeType === 1) {
              contentParts.push(el.cloneNode(true));
            } else if (el.nodeType === 3) {
              const txt = el.textContent.trim();
              if (txt) contentParts.push(document.createTextNode(txt));
            }
          });
          contentCell = contentParts.length === 1 ? contentParts[0] : contentParts;
          break;
        }
        if (nextNode.nodeType === 1 && nextNode.classList.contains('accordions__toggler')) {
          break;
        }
      }
      if (contentCell) {
        accordionRows.push([titleText, contentCell]);
      }
    }
  }

  // Compose the table rows: only header and accordion items
  const rows = [headerRow, ...accordionRows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);

  // Now insert all non-accordion content before and after the block, in correct order
  // Find the indices for the first and last accordion toggler/element
  let firstAccordionIdx = children.findIndex(n => n.nodeType === 1 && (n.classList.contains('accordions__toggler') || n.classList.contains('accordions__element')));
  let lastAccordionIdx = -1;
  for (let idx = children.length - 1; idx >= 0; idx--) {
    if (children[idx].nodeType === 1 && (children[idx].classList.contains('accordions__toggler') || children[idx].classList.contains('accordions__element'))) {
      lastAccordionIdx = idx;
      break;
    }
  }

  // Helper to insert nodes before/after block, skipping empty paragraphs
  function insertContent(nodes, refBlock, before = true) {
    nodes.forEach((n) => {
      if (n.nodeType === 1) {
        // Skip empty paragraphs
        if (n.tagName === 'P' && (!n.textContent.trim() || n.innerHTML.trim() === '&nbsp;')) return;
        refBlock.parentNode.insertBefore(n.cloneNode(true), before ? refBlock : refBlock.nextSibling);
      } else if (n.nodeType === 3) {
        const txt = n.textContent.trim();
        if (txt) {
          refBlock.parentNode.insertBefore(document.createTextNode(txt), before ? refBlock : refBlock.nextSibling);
        }
      }
    });
  }

  // Insert content before the block
  if (firstAccordionIdx > 0) {
    const beforeNodes = children.slice(0, firstAccordionIdx);
    insertContent(beforeNodes, block, true);
  }
  // Insert content after the block
  if (lastAccordionIdx >= 0 && lastAccordionIdx < children.length - 1) {
    const afterNodes = children.slice(lastAccordionIdx + 1);
    insertContent(afterNodes, block, false);
  }
}
