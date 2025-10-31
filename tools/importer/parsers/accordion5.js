/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion5)'];
  const rows = [headerRow];

  // Find the accordion toggler (title)
  const toggler = element.querySelector('.accordions__toggler');
  // Find the corresponding content element (the next sibling div)
  let contentDiv = toggler && toggler.nextElementSibling;

  // Compose the accordion content: only the details (tables, footnotes, etc.)
  if (toggler && contentDiv) {
    const accordionContent = document.createElement('div');
    // Add all elements from contentDiv up to and including the footnote
    let node = contentDiv;
    while (node && (node.tagName !== 'P' || !node.textContent.trim().startsWith('* Tidligste udbetalingsalder'))) {
      // Only add one table (prefer show-in-print)
      if (node.tagName === 'TABLE' && node.classList.contains('show-in-print')) {
        accordionContent.appendChild(node.cloneNode(true));
      } else if (node.tagName !== 'TABLE') {
        accordionContent.appendChild(node.cloneNode(true));
      }
      node = node.nextElementSibling;
    }
    // Add the footnote if present
    if (node && node.tagName === 'P' && node.textContent.trim().startsWith('* Tidligste udbetalingsalder')) {
      accordionContent.appendChild(node.cloneNode(true));
    }
    rows.push([
      toggler,
      accordionContent
    ]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
