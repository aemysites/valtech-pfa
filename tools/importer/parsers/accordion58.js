/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion (accordion58) block parsing
  // Header row as required
  const headerRow = ['Accordion (accordion58)'];

  // Find the toggler/title element
  // In this HTML, it's a <p class="accordions__toggler">
  const toggler = element.querySelector('.accordions__toggler');

  // Find the content element: the next sibling div with class 'accordions__element' or 'accordion__element'
  // It contains the actual accordion panel content
  let content = null;
  const togglerParent = toggler && toggler.parentElement;
  if (togglerParent) {
    // Look for .accordions__element or .accordion__element within the parent
    content = togglerParent.querySelector('.accordions__element, .accordion__element');
  }

  // Defensive: If not found, fallback to next sibling
  if (!content && toggler) {
    let next = toggler.nextElementSibling;
    while (next) {
      if (next.classList.contains('accordions__element') || next.classList.contains('accordion__element')) {
        content = next;
        break;
      }
      next = next.nextElementSibling;
    }
  }

  // Compose table rows: header, then each accordion item as [title, content]
  const rows = [headerRow];
  if (toggler && content) {
    rows.push([toggler, content]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
