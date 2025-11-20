/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion121)'];

  // Find the main content container
  let mainCol = null;
  const children = Array.from(element.querySelectorAll(':scope > div'));
  for (const child of children) {
    if (child.classList.contains('container-fluid')) {
      const row = child.querySelector('.row.teasers');
      if (row) {
        mainCol = row.querySelector('.col-sm-12');
        break;
      }
    }
  }
  if (!mainCol) mainCol = element;

  // Extract all heading, paragraphs, and lists before the first .accordions__toggler
  const allNodes = Array.from(mainCol.childNodes);
  let introFragment = document.createElement('div');
  for (const node of allNodes) {
    if (node.classList && node.classList.contains('accordions__toggler')) break;
    if (
      node.nodeType === Node.ELEMENT_NODE &&
      (node.tagName === 'H2' || node.tagName === 'P' || node.tagName === 'UL')
    ) {
      introFragment.appendChild(node.cloneNode(true));
    }
  }

  // Find all accordions
  const togglers = Array.from(mainCol.querySelectorAll('.accordions__toggler'));
  const elements = Array.from(mainCol.querySelectorAll('.accordions__element'));

  // Compose rows for the accordion block, include all tables (show-in-print and hide-in-print) per accordion
  const rows = [headerRow];
  for (let i = 0; i < togglers.length && i < elements.length; i++) {
    const title = togglers[i].textContent.trim();
    const contentFragment = document.createElement('div');
    // Include all tables inside the accordion element
    const tables = elements[i].querySelectorAll('table');
    if (tables.length) {
      tables.forEach(tbl => contentFragment.appendChild(tbl.cloneNode(true)));
    } else {
      contentFragment.appendChild(elements[i].cloneNode(true));
    }
    rows.push([title, contentFragment]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Insert the intro content before the accordion block
  if (introFragment.childNodes.length) {
    element.parentNode.insertBefore(introFragment, element);
  }

  // Replace original element
  element.replaceWith(block);
}
