/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion20)'];

  // Helper to extract accordion items (title and content)
  function extractAccordionItems(root) {
    const items = [];
    // Find all toggler elements (accordion headers)
    const togglers = Array.from(root.querySelectorAll('.accordions__toggler'));
    togglers.forEach((toggler) => {
      // The content element is the next sibling with class 'accordions__element'
      let content = toggler.nextElementSibling;
      if (!content || !content.classList.contains('accordions__element')) {
        // If there is no content element, treat as empty content
        items.push([toggler.cloneNode(true), '']);
      } else {
        items.push([toggler.cloneNode(true), content.cloneNode(true)]);
      }
    });
    return items;
  }

  // Extract accordion items
  let accordionRoot = element;
  const allTogglers = element.querySelectorAll('.accordions__toggler');
  if (allTogglers.length > 0) {
    accordionRoot = allTogglers[0].closest('.row, .container-fluid, .col-sm-12, .anchor') || element;
  }
  const rows = extractAccordionItems(accordionRoot);

  // Compose table cells
  const cells = [headerRow, ...rows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
