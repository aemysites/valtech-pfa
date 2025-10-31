/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion4)'];

  // Find heading and intro paragraph
  const heading = element.querySelector('h2');
  const intro = element.querySelector('h2 + p');

  // Find the accordion toggler (title for the accordion item)
  const toggler = element.querySelector('.accordions__toggler');

  // Find the content for the accordion item (the next sibling with .accordions__element)
  const accordionContent = toggler && toggler.nextElementSibling;

  // Compose left cell: heading + intro + toggler
  const leftCell = document.createElement('div');
  if (heading) leftCell.appendChild(heading.cloneNode(true));
  if (intro) leftCell.appendChild(intro.cloneNode(true));
  if (toggler) leftCell.appendChild(toggler.cloneNode(true));

  // Compose right cell: accordion content
  let rightCell = '';
  if (accordionContent) {
    rightCell = accordionContent.cloneNode(true);
  }

  // Build the rows for the block
  const rows = [
    headerRow,
    [leftCell, rightCell]
  ];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
