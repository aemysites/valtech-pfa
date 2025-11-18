/* global WebImporter */
export default function parse(element, { document }) {
  // Extract heading and intro paragraph
  const heading = element.querySelector('h2, h1');
  const intro = element.querySelector('p:not(.accordions__toggler)');

  // Accordion block: extract toggler and content
  const toggler = element.querySelector('.accordions__toggler');
  const contentBlock = element.querySelector('.accordions__element, .accordion__element');

  // Build the table rows
  const headerRow = ['Accordion (accordion28)'];
  const rows = [];

  // Add accordion row if toggler and content exist
  if (toggler && contentBlock) {
    // Compose the title cell: heading + intro + toggler
    const titleCell = document.createElement('div');
    if (heading) titleCell.appendChild(heading.cloneNode(true));
    if (intro) titleCell.appendChild(intro.cloneNode(true));
    titleCell.appendChild(toggler.cloneNode(true));
    rows.push([
      titleCell,
      contentBlock
    ]);
  }

  // Create the table using WebImporter.DOMUtils.createTable
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  // Replace the original element with the table
  element.replaceWith(table);
}
