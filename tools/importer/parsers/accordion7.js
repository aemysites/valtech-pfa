/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract all accordion items, flattening nested accordions into separate rows
  function extractAccordionItems(root) {
    const items = [];
    // Find all toggler/element pairs in document order
    const togglers = Array.from(root.querySelectorAll('.accordions__toggler'));
    togglers.forEach(toggler => {
      // Find the next sibling .accordions__element (not nested, only direct pair)
      let content = null;
      let sibling = toggler.nextElementSibling;
      while (sibling) {
        if (sibling.classList.contains('accordions__element')) {
          content = sibling;
          break;
        }
        // Stop if we hit another toggler before finding an element
        if (sibling.classList.contains('accordions__toggler')) break;
        sibling = sibling.nextElementSibling;
      }
      if (content) {
        // For this accordion item, extract only the direct content (not nested accordions)
        const contentClone = document.createElement('div');
        // Only include <p>, <ul>, <ol>, <a>, <strong>, <em>, <br> direct children
        Array.from(content.childNodes).forEach(node => {
          if (
            node.nodeType === 1 && (
              ['P', 'UL', 'OL', 'A', 'STRONG', 'EM', 'BR'].includes(node.tagName)
            )
          ) {
            contentClone.appendChild(node.cloneNode(true));
          } else if (node.nodeType === 3 && node.textContent.trim()) {
            // Text node
            contentClone.appendChild(document.createTextNode(node.textContent));
          }
        });
        items.push([toggler.textContent.trim(), contentClone]);
      }
    });
    return items;
  }

  // The block header row
  const headerRow = ['Accordion (accordion7)'];
  // Find the main accordion container (the .row)
  const root = element.closest('.row') || element;
  // Extract all accordion items (flattened)
  const accordionItems = extractAccordionItems(root);
  // Build the table rows
  const rows = [headerRow];
  accordionItems.forEach(([title, content]) => {
    rows.push([title, content]);
  });
  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
