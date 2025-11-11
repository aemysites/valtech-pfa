/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block parsing for Accordion (accordion32)
  // Find the toggler/title for the accordion item
  const toggler = element.querySelector('.accordions__toggler');

  // Find the accordion content block (may contain paragraphs, links, images)
  const accordionElement = element.querySelector('.accordions__element');
  let contentCell = null;
  if (accordionElement) {
    // The actual content is inside the first child div of .accordions__element
    const contentDiv = accordionElement.querySelector('div');
    if (contentDiv) {
      // Put all children of contentDiv into an array
      contentCell = Array.from(contentDiv.children);
    } else {
      // Defensive fallback: use all children of .accordions__element
      contentCell = Array.from(accordionElement.children);
    }
  } else {
    contentCell = document.createElement('span');
    contentCell.textContent = '';
  }

  // Defensive fallback if toggler not found
  const titleCell = toggler ? toggler : document.createElement('span');
  if (!toggler) titleCell.textContent = '';

  // Table header row
  const headerRow = ['Accordion (accordion32)'];

  // Table rows: each accordion item is a row with [title, content]
  const rows = [
    headerRow,
    [titleCell, contentCell]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
