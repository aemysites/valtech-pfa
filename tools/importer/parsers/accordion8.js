/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract accordion items from a column
  function extractAccordionItems(column) {
    const items = [];
    // Each accordion group is a .teasers__teaser
    column.querySelectorAll('.teasers__teaser').forEach(teaser => {
      // The first toggler is the main accordion title
      const toggler = teaser.querySelector('.accordions__toggler');
      if (!toggler) return;
      // Gather all toggler/content pairs within this teaser
      const children = Array.from(teaser.children);
      let i = 0;
      while (i < children.length) {
        if (children[i].classList && children[i].classList.contains('accordions__toggler')) {
          // Accordion item title
          const title = children[i];
          // Next sibling should be the content element
          let content = null;
          if (i + 1 < children.length && children[i + 1].classList && children[i + 1].classList.contains('accordions__element')) {
            content = children[i + 1];
            i += 2;
          } else {
            // Defensive: If no content, use empty div
            content = document.createElement('div');
            i += 1;
          }
          items.push([title, content]);
        } else if (children[i].classList && children[i].classList.contains('accordions__element')) {
          // Sometimes the first .accordions__element is just a wrapper, skip
          i += 1;
        } else {
          i += 1;
        }
      }
    });
    return items;
  }

  // Find both columns
  const columns = element.querySelectorAll('.col-xs-12.col-sm-6');
  const cells = [
    ['Accordion (accordion8)'] // Header row
  ];
  columns.forEach(col => {
    const accordionItems = extractAccordionItems(col);
    cells.push(...accordionItems);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
