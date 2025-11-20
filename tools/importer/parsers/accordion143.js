/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content panel
  const panel = element.querySelector('.panel--text');
  if (!panel) return;

  // Prepare header row as required
  const headerRow = ['Accordion (accordion143)'];
  const rows = [headerRow];

  // Find all accordion toggler elements and their corresponding content
  const togglers = Array.from(panel.querySelectorAll('.accordions__toggler'));
  for (const toggler of togglers) {
    // The content element is the next sibling with class .accordions__element
    let content = toggler.nextElementSibling;
    if (!content || !content.classList.contains('accordions__element')) {
      continue; // Defensive: skip if structure is broken
    }
    // Title cell: use only the textContent of the toggler
    const titleCell = toggler.textContent.trim();
    // Content cell: reference all children if present, otherwise the content element itself
    let contentCell;
    if (content.children.length > 0) {
      contentCell = Array.from(content.children);
    } else {
      contentCell = [content];
    }
    rows.push([titleCell, contentCell]);
  }

  // Create the table
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    // Place all intro content (before first toggler) above the table, filtering out empty/irrelevant nodes
    const introContent = [];
    for (const child of panel.children) {
      if (child.classList.contains('accordions__toggler')) break;
      // Filter out empty .accordions__element and empty paragraphs
      if (
        (child.classList.contains('accordions__element') && child.textContent.trim() === '') ||
        (child.tagName === 'P' && child.textContent.trim() === '')
      ) {
        continue;
      }
      introContent.push(child.cloneNode(true));
    }
    if (introContent.length) {
      const wrapper = document.createElement('div');
      introContent.forEach((node) => wrapper.appendChild(node));
      element.replaceWith(wrapper, table);
    } else {
      element.replaceWith(table);
    }
  }
}
