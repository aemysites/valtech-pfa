/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion8)'];
  const rows = [headerRow];

  // Find main heading and intro paragraph
  const h2 = element.querySelector('h2');
  const introP = h2 ? h2.nextElementSibling : null;

  // Add heading and intro paragraph as their own row (single cell)
  if (h2 && introP) {
    rows.push([ [h2, introP] ]);
  }

  // Find the accordion toggler (title for first item)
  const toggler = element.querySelector('.accordions__toggler');
  // Find the accordion content (the expanded/collapsed content)
  const accordionContent = element.querySelector('.accordions__element');

  // Only add accordion item if toggler and content exist
  if (toggler && accordionContent) {
    rows.push([toggler, accordionContent]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
