/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content area
  const mainContent = element.querySelector('.container-fluid');
  if (!mainContent) return;
  const col = mainContent.querySelector('.col-sm-12');
  if (!col) return;

  // Get heading and intro paragraph(s)
  const header = col.querySelector('h2');
  const allPs = Array.from(col.querySelectorAll('p'));
  // Find first toggler
  const firstTogglerIdx = allPs.findIndex(p => p.classList.contains('accordions__toggler'));
  let introCell = [];
  if (header) introCell.push(header);
  if (firstTogglerIdx > 0) {
    introCell.push(...allPs.slice(0, firstTogglerIdx).filter(p => p.textContent.trim() !== ''));
  }

  // Find all accordion toggler and content pairs
  const togglers = Array.from(col.querySelectorAll('.accordions__toggler'));
  const elements = Array.from(col.querySelectorAll('.accordions__element'));

  // Compose accordion rows
  const rows = [];
  rows.push(['Accordion (accordion9)']);
  for (let i = 0; i < togglers.length && i < elements.length; i++) {
    rows.push([togglers[i], elements[i]]);
  }

  // Find the final informational paragraph (footer)
  let lastElement = elements.length ? elements[elements.length - 1] : null;
  let footerP = null;
  if (lastElement) {
    let next = lastElement.nextElementSibling;
    while (next) {
      if (next.tagName === 'P' && !next.classList.contains('accordions__toggler')) {
        if (next.textContent.trim() !== '') {
          footerP = next;
          break;
        }
      }
      next = next.nextElementSibling;
    }
  }

  // Replace element with intro, table, and footer in correct order
  const fragment = document.createDocumentFragment();
  if (introCell.length) {
    introCell.forEach(node => fragment.appendChild(node.cloneNode(true)));
  }
  const table = WebImporter.DOMUtils.createTable(rows, document);
  fragment.appendChild(table);
  if (footerP) {
    fragment.appendChild(footerP.cloneNode(true));
  }
  element.replaceWith(fragment);
}
