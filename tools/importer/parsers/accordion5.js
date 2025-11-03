/* global WebImporter */
export default function parse(element, { document }) {
  // Find the heading and intro paragraph
  const heading = element.querySelector('h2');
  const introPara = heading ? heading.nextElementSibling : null;

  // Find the accordion toggler/title
  const toggler = element.querySelector('.accordions__toggler');
  const accordionTitle = toggler ? toggler.textContent.trim() : '';

  // Find the accordion content block
  const accordionElement = element.querySelector('.accordions__element');

  // Compose the content cell: include heading, intro paragraph, and ALL content inside the accordion element
  const contentCell = document.createElement('div');
  if (heading) contentCell.appendChild(heading.cloneNode(true));
  if (introPara && introPara.tagName === 'P') contentCell.appendChild(introPara.cloneNode(true));
  if (accordionElement) {
    Array.from(accordionElement.childNodes).forEach((node) => {
      contentCell.appendChild(node.cloneNode(true));
    });
  }

  // Build the rows for the block table
  const rows = [];
  // Header row (block name)
  rows.push(['Accordion (accordion5)']);
  // Accordion item: Title and Content
  rows.push([accordionTitle, contentCell]);

  // Replace the original element with the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
