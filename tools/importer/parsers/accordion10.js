/* global WebImporter */
export default function parse(element, { document }) {
  // Extract heading and intro paragraph from the top of the block
  const heading = element.querySelector('h2');
  const intro = element.querySelector('h2 + p');
  if (heading || intro) {
    const introDiv = document.createElement('div');
    if (heading) introDiv.appendChild(heading.cloneNode(true));
    if (intro) introDiv.appendChild(intro.cloneNode(true));
    // Insert introDiv before the block table
    element.parentNode.insertBefore(introDiv, element);
  }

  // Accordion block header
  const headerRow = ['Accordion (accordion10)'];
  const rows = [headerRow];

  // Only include accordion items in the table
  const togglers = Array.from(element.querySelectorAll('p.accordions__toggler'));
  togglers.forEach((toggler) => {
    // Title cell: use the toggler paragraph itself
    const titleCell = toggler;
    // Content cell: find the next sibling div with class 'accordions__element'
    let contentCell = null;
    let next = toggler.nextElementSibling;
    while (next && !next.classList.contains('accordions__element')) {
      next = next.nextElementSibling;
    }
    if (next && next.classList.contains('accordions__element')) {
      contentCell = next;
    } else {
      contentCell = document.createElement('div');
    }
    rows.push([titleCell, contentCell]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the block
  element.replaceWith(block);
}
