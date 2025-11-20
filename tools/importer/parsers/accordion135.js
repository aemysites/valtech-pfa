/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion135)'];

  // Find the section heading
  const heading = element.querySelector('h2');

  // Find the accordion toggler/title and content for the accordion item
  const toggler = element.querySelector('.accordions__toggler');
  const content = element.querySelector('.accordions__element, .accordion__element');

  // Defensive: If not found, fallback to empty text node
  const titleCell = toggler ? toggler : document.createTextNode('');
  const contentCell = content ? content : document.createTextNode('');

  // Build table rows: first row is header, second is [title, content]
  const rows = [
    headerRow,
    [titleCell, contentCell]
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // If heading exists, insert it before the table
  if (heading) {
    const wrapper = document.createElement('div');
    wrapper.appendChild(heading.cloneNode(true));
    wrapper.appendChild(table);
    element.replaceWith(wrapper);
  } else {
    element.replaceWith(table);
  }
}
