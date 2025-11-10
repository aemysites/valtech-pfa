/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block parsing for Accordion (accordion36)
  // Only reference existing elements, preserve semantic meaning, and handle edge cases

  // Helper selectors
  const togglerSelector = '.accordions__toggler';
  const contentSelector = '.accordions__element';

  // Find all direct children of the main accordion container
  // Defensive: Only top-level accordion items
  const mainContainer = element.querySelector('.container-fluid .row.teasers .col-sm-12');
  if (!mainContainer) return;

  // Get all children in order
  const children = Array.from(mainContainer.children);

  // Compose accordion rows: [title, content]
  const rows = [];
  let i = 0;
  while (i < children.length) {
    const child = children[i];
    if (child.classList.contains('accordions__toggler')) {
      // Title cell: reference the toggler element
      const titleCell = child;
      // Find the next sibling with .accordions__element
      let contentCell = null;
      let j = i + 1;
      while (j < children.length) {
        if (children[j].classList.contains('accordions__element')) {
          contentCell = children[j];
          break;
        }
        j++;
      }
      // Defensive: If no content found, use empty div
      if (!contentCell) {
        contentCell = document.createElement('div');
      }
      rows.push([titleCell, contentCell]);
      i = j + 1;
    } else {
      i++;
    }
  }

  // Table header row: must match block name exactly
  const headerRow = ['Accordion (accordion36)'];

  // Final table: header + rows
  const tableRows = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace original element
  element.replaceWith(table);
}
