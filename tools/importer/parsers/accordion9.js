/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract accordion items from the given structure
  function extractAccordionItems(root) {
    const items = [];
    // Find all teasers__teaser blocks (each is a top-level accordion group)
    const teasers = Array.from(root.querySelectorAll('.teasers__teaser'));
    teasers.forEach(teaser => {
      // Find all direct children that are toggler paragraphs
      const togglers = Array.from(teaser.children).filter(
        el => el.matches('p.accordions__toggler')
      );
      togglers.forEach(toggler => {
        // The content element is the next sibling with class 'accordions__element'
        let content = toggler.nextElementSibling;
        if (content && content.classList.contains('accordions__element')) {
          items.push([toggler, content]);
        }
      });
    });
    return items;
  }

  // The header row MUST be a single cell
  const headerRow = ['Accordion (accordion9)'];

  // Extract all accordion items from both columns
  let accordionItems = [];
  let columns = Array.from(element.querySelectorAll('.col-xs-12.col-sm-6'));
  if (columns.length === 0) {
    columns = [element];
  }
  columns.forEach(col => {
    accordionItems = accordionItems.concat(extractAccordionItems(col));
  });
  if (accordionItems.length === 0) {
    accordionItems = extractAccordionItems(element);
  }

  // Compose the table rows
  const rows = [headerRow];
  accordionItems.forEach(([titleEl, contentEl]) => {
    rows.push([titleEl, contentEl]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
