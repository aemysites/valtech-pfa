/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion32)'];

  // Find the accordion toggler/title
  const toggler = element.querySelector('.accordions__toggler');

  // Find the accordion content block
  const accordionElement = element.querySelector('.accordions__element');

  let contentCell = null;
  if (accordionElement) {
    // Use the inner container (usually a <div>) for all content
    const innerContent = accordionElement.querySelector('div');
    if (innerContent) {
      contentCell = innerContent;
    } else {
      // Fallback: use all children of .accordions__element
      contentCell = document.createElement('div');
      Array.from(accordionElement.childNodes).forEach((node) => {
        contentCell.appendChild(node.cloneNode(true));
      });
    }
  }

  // Defensive: If toggler or content missing, skip row
  if (!toggler || !contentCell) {
    return;
  }

  // Build table rows
  const rows = [
    headerRow,
    [toggler, contentCell]
  ];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
