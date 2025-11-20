/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion131)'];
  const rows = [headerRow];

  // Find the main container for accordion items
  const mainCol = element.querySelector('.col-sm-12');
  if (!mainCol) return;

  // Get all direct children of mainCol
  const children = Array.from(mainCol.children);

  // Find all toggler and content pairs, FLAT, ignoring nested accordions
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child.matches && child.matches('p.accordions__toggler')) {
      // Find the next sibling that is a .accordions__element
      let content = '';
      for (let j = i + 1; j < children.length; j++) {
        const node = children[j];
        if (node.matches && node.matches('div.accordions__element')) {
          content = node;
          break;
        }
        // If we hit another toggler, break
        if (node.matches && node.matches('p.accordions__toggler')) {
          break;
        }
      }
      rows.push([child, content]);
    }
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
