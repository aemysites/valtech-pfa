/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion8)'];

  // Find main heading and intro paragraph
  const heading = element.querySelector('h2');
  const intro = heading ? heading.nextElementSibling : null;

  // Find the accordion toggler (title for the first item)
  const toggler = element.querySelector('.accordions__toggler');
  // Find the accordion content element (the expanded/collapsible content)
  const accordionContent = element.querySelector('.accordions__element');

  const rows = [];

  if (toggler && accordionContent) {
    // Compose the content cell: heading + intro + both tables + explanatory notes
    const contentDiv = document.createElement('div');
    if (heading) contentDiv.appendChild(heading.cloneNode(true));
    if (intro) contentDiv.appendChild(intro.cloneNode(true));
    // Include both tables if present
    const tables = accordionContent.querySelectorAll('table');
    tables.forEach(table => {
      contentDiv.appendChild(table.cloneNode(true));
    });
    // Also include any explanatory notes after the accordion content
    let next = accordionContent.nextElementSibling;
    while (next) {
      if (next.tagName === 'P' && next.textContent.trim()) {
        contentDiv.appendChild(next.cloneNode(true));
      }
      next = next.nextElementSibling;
    }
    rows.push([
      toggler,
      contentDiv
    ]);
  }

  // Compose the final table: header row, then accordion rows
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
