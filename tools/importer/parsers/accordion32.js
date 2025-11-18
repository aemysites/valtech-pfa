/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion32)'];

  // Find the accordion toggler/title and extract plain text only
  const toggler = element.querySelector('.accordions__toggler');
  const titleText = toggler ? toggler.textContent.trim() : 'Accordion Item';

  // Find the accordion content block
  const accordionElement = element.querySelector('.accordions__element, .accordion__element');

  // Get the content inside the accordion item
  let contentCell = document.createElement('span');
  if (accordionElement) {
    const contentWrapper = accordionElement.querySelector('div');
    if (contentWrapper) {
      contentCell = document.createElement('span');
      Array.from(contentWrapper.children).forEach(child => contentCell.appendChild(child.cloneNode(true)));
    } else {
      contentCell = document.createElement('span');
      Array.from(accordionElement.children).forEach(child => contentCell.appendChild(child.cloneNode(true)));
    }
  }

  // Build rows for the table
  const rows = [headerRow, [titleText, contentCell]];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
