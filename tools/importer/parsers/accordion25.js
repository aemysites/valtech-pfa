/* global WebImporter */
export default function parse(element, { document }) {
  // Always start with the required header row
  const rows = [['Accordion (accordion25)']];

  // Helper: Given a toggler, find its content block
  function findContent(toggler) {
    let next = toggler.nextElementSibling;
    while (next) {
      if (next.classList.contains('accordions__element') || next.classList.contains('accordion__element')) {
        return next;
      }
      next = next.nextElementSibling;
    }
    return null;
  }

  // Only top-level togglers (direct children of .col-sm-12)
  const mainCol = element.querySelector('.col-sm-12');
  if (mainCol) {
    Array.from(mainCol.children).forEach(child => {
      if (child.classList.contains('accordions__toggler') && child.textContent.trim()) {
        const content = findContent(child);
        if (content) {
          rows.push([child, content]);
        }
      }
    });
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
