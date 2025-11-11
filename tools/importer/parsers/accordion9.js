/* global WebImporter */
export default function parse(element, { document }) {
  // Use less specific selectors to ensure all text content is captured
  const container = element.querySelector('.container-fluid') || element;
  const col = container.querySelector('.col-sm-12') || container;
  const children = Array.from(col.children);

  // Find all toggler and content pairs
  const accordionRows = [];
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child.classList.contains('accordions__toggler')) {
      // Title cell: include the entire toggler element
      const titleCell = child.cloneNode(true);
      // Content cell: find the next accordions__element
      let contentCell = null;
      for (let j = i + 1; j < children.length; j++) {
        const next = children[j];
        if (next.classList.contains('accordions__element')) {
          contentCell = next.cloneNode(true);
          break;
        }
        if (next.classList.contains('accordions__toggler')) {
          break;
        }
      }
      if (contentCell) {
        accordionRows.push([titleCell, contentCell]);
      }
    }
  }

  // Build the table data
  const headerRow = ['Accordion (accordion9)'];
  const tableData = [headerRow, ...accordionRows];
  const table = WebImporter.DOMUtils.createTable(tableData, document);

  // Gather all content before the first toggler (intro)
  let firstTogglerIdx = children.findIndex(c => c.classList.contains('accordions__toggler'));
  for (let i = 0; i < firstTogglerIdx; i++) {
    const node = children[i];
    if (node.tagName === 'H2' || (node.tagName === 'P' && node.textContent.trim() && node.textContent.trim() !== '\u00a0')) {
      table.before(node.cloneNode(true));
    }
  }

  // Gather all content after the last accordion element (outro)
  let lastAccordionIdx = -1;
  for (let i = children.length - 1; i >= 0; i--) {
    if (children[i].classList.contains('accordions__element')) {
      lastAccordionIdx = i;
      break;
    }
  }
  // Collect all elements after the last accordion element, including all paragraphs and headings
  for (let i = lastAccordionIdx + 1; i < children.length; i++) {
    const node = children[i];
    if ((['H2','H5','P'].includes(node.tagName)) && node.textContent.trim() && node.textContent.trim() !== '\u00a0') {
      table.after(node.cloneNode(true));
    }
  }

  // Replace the original element
  element.replaceWith(table);
}
