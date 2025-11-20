/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block: extract only top-level accordion items (not nested ones)
  // Block header must match: Accordion (accordion36)
  const headerRow = ['Accordion (accordion36)'];
  const rows = [headerRow];

  // Find all top-level toggler paragraphs (direct children of the main accordion container)
  // These are not nested inside another .accordions__element
  const topLevelTogglers = Array.from(element.querySelectorAll('p.accordions__toggler'))
    .filter(toggler => {
      // Only include togglers whose parent does NOT have class 'accordions__element'
      return !(toggler.parentElement && toggler.parentElement.classList.contains('accordions__element'));
    });

  topLevelTogglers.forEach((toggler) => {
    // The content is the next sibling div.accordions__element
    let content = toggler.nextElementSibling;
    while (content && !(content.tagName === 'DIV' && content.classList.contains('accordions__element'))) {
      content = content.nextElementSibling;
    }
    if (content) {
      rows.push([toggler, content]);
    }
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Move the heading above the table if present
  const heading = element.querySelector('h2');
  if (heading && element.contains(heading)) {
    element.parentElement.insertBefore(heading, element);
  }

  // Replace the original element
  element.replaceWith(table);
}
