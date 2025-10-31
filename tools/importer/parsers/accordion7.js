/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract all accordion items from the given element
  function extractAccordionItems(root) {
    const items = [];
    // Find all top-level teasers (each is a block of accordion items)
    const teasers = Array.from(root.querySelectorAll('.teasers__teaser'));
    teasers.forEach(teaser => {
      // Each teaser starts with a toggler (title), followed by an accordion__element (content)
      let childNodes = Array.from(teaser.childNodes).filter(n => n.nodeType === 1); // Only elements
      for (let i = 0; i < childNodes.length; i++) {
        const node = childNodes[i];
        // Find toggler
        if (node.classList.contains('accordions__toggler')) {
          const title = node;
          // Find the next sibling accordion__element (content)
          let content = null;
          for (let j = i + 1; j < childNodes.length; j++) {
            if (childNodes[j].classList.contains('accordion__element') || childNodes[j].classList.contains('accordions__element')) {
              content = childNodes[j];
              break;
            }
          }
          if (content) {
            items.push([title, content]);
          }
        }
      }
    });
    return items;
  }

  // Compose the table rows
  const headerRow = ['Accordion (accordion7)'];
  const rows = [headerRow];

  // Find both columns (left/right) in the main row
  const columns = Array.from(element.querySelectorAll('.col-xs-12.col-sm-6'));
  columns.forEach(col => {
    const accordionItems = extractAccordionItems(col);
    rows.push(...accordionItems);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
