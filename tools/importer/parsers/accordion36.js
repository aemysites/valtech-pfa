/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion36)'];
  const rows = [headerRow];

  // Get the main heading (if present)
  const heading = element.querySelector('h2');
  if (heading) {
    // Add heading as a separate row (optional, or as part of first accordion item)
    // For Accordion block, it's usually not a separate row, so skip adding as a row
    // But if needed, could be included in the first item's content
  }

  // Find all top-level accordion toggler/content pairs
  // These are direct children of the main container
  const mainContainer = element.querySelector('.row.teasers .col-sm-12');
  if (!mainContainer) return;

  // Find all toggler elements and their content panels
  const children = Array.from(mainContainer.children);
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child.tagName === 'P' && child.classList.contains('accordions__toggler')) {
      const titleCell = child.cloneNode(true);
      // Find the next sibling that is a content panel
      let contentCell = null;
      for (let j = i + 1; j < children.length; j++) {
        const next = children[j];
        if (next.tagName === 'DIV' && next.classList.contains('accordions__element')) {
          contentCell = next.cloneNode(true);
          break;
        }
        // If we hit another toggler before a content panel, break
        if (next.tagName === 'P' && next.classList.contains('accordions__toggler')) {
          break;
        }
      }
      if (contentCell) {
        rows.push([titleCell, contentCell]);
      }
    }
  }

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
