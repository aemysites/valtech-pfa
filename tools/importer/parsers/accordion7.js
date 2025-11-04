/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Extract all accordion items from the given element
  function extractAccordionItems(root) {
    const items = [];
    // Find all direct children that are accordion containers
    const teasers = Array.from(root.querySelectorAll('.teasers__teaser'));
    teasers.forEach(teaser => {
      // Find all toggler elements and their corresponding content
      const togglers = Array.from(teaser.querySelectorAll('.accordions__toggler'));
      togglers.forEach(toggler => {
        // The content is the next sibling .accordions__element
        let content = toggler.nextElementSibling;
        // Defensive: Only proceed if content is present and has the correct class
        if (content && content.classList.contains('accordions__element')) {
          // Title cell: Use the toggler element itself
          // Content cell: Use the entire content element
          items.push([
            toggler,
            content
          ]);
        }
      });
    });
    return items;
  }

  // Get all accordion items from both columns
  let allItems = [];
  // Defensive: The source HTML has two columns, each with .col-xs-12.col-sm-6
  const columns = Array.from(element.querySelectorAll('.col-xs-12.col-sm-6'));
  columns.forEach(col => {
    allItems = allItems.concat(extractAccordionItems(col));
  });

  // If no columns found, fallback to parsing the element itself
  if (allItems.length === 0) {
    allItems = extractAccordionItems(element);
  }

  // Table header row
  const headerRow = ['Accordion (accordion7)'];
  // Build cells array: header + all accordion items
  const cells = [headerRow, ...allItems];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
