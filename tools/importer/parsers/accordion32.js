/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion32)'];

  // Defensive: Find the accordion toggler/title
  // The toggler is a <p> with class 'accordions__toggler'
  const toggler = element.querySelector('.accordions__toggler');

  // Defensive: Find the accordion content block
  // The content is inside '.accordions__element' (may be nested)
  const accordionElement = element.querySelector('.accordions__element');

  let contentCell = null;
  if (accordionElement) {
    // The actual content is inside the first child <div> of .accordions__element
    // We'll collect all children of that div as the content
    const contentDiv = accordionElement.querySelector('div');
    if (contentDiv) {
      // Gather all children (paragraphs, links, images, etc.)
      contentCell = Array.from(contentDiv.children);
    } else {
      // Fallback: use all children of .accordions__element
      contentCell = Array.from(accordionElement.children);
    }
  }

  // Compose the table rows
  const rows = [headerRow];

  // Only add the accordion item if we have a title and content
  if (toggler && contentCell && contentCell.length > 0) {
    rows.push([toggler, contentCell]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
