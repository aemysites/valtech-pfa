/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion28)'];

  // Find all accordion toggler/content pairs
  const accordionRows = [];
  const togglers = element.querySelectorAll('.accordions__toggler');

  togglers.forEach((toggler) => {
    // The content is the next sibling with class .accordions__element or .accordion__element
    let content = toggler.nextElementSibling;
    while (content && !content.classList.contains('accordions__element') && !content.classList.contains('accordion__element')) {
      content = content.nextElementSibling;
    }
    if (content) {
      accordionRows.push([
        toggler,
        content
      ]);
    }
  });

  // Create the block table
  const rows = [headerRow, ...accordionRows];
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new block
  element.replaceWith(table);
}
