/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract accordion items from a column
  function extractAccordionItems(col) {
    const items = [];
    col.querySelectorAll('.teasers__teaser').forEach(teaser => {
      let children = Array.from(teaser.children);
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.classList && child.classList.contains('accordions__toggler')) {
          // Find the next .accordions__element sibling after this toggler
          let content = null;
          for (let j = i + 1; j < children.length; j++) {
            if (children[j].classList && children[j].classList.contains('accordions__element')) {
              content = children[j];
              break;
            }
          }
          if (content) {
            // Gather all content inside the .accordions__element (including nested blocks)
            let contentBlocks = [];
            Array.from(content.childNodes).forEach(node => {
              if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '')) {
                contentBlocks.push(node.cloneNode(true));
              }
            });
            // If content is empty, preserve empty string
            if (contentBlocks.length === 0) {
              contentBlocks = [''];
            }
            items.push([
              child.textContent.trim(),
              contentBlocks.length === 1 ? contentBlocks[0] : contentBlocks
            ]);
          }
        }
      }
    });
    return items;
  }

  // Get both columns
  const columns = element.querySelectorAll(':scope > div.row > div');
  let rows = [['Accordion (accordion10)']]; // Header row

  columns.forEach(col => {
    const items = extractAccordionItems(col);
    rows = rows.concat(items);
  });

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
