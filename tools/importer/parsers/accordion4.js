/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion4)'];

  // Find heading and intro paragraph
  const h2 = element.querySelector('h2');
  let introPs = [];
  if (h2) {
    let next = h2.nextElementSibling;
    while (next && next.tagName === 'P' && !next.classList.contains('accordions__toggler')) {
      introPs.push(next);
      next = next.nextElementSibling;
    }
  }

  // Find the toggler (accordion title)
  const toggler = element.querySelector('.accordions__toggler');

  // Find the accordion content container
  const accordionElement = element.querySelector('.accordions__element');

  // Compose accordion content: intro, table, and any notes
  const accordionContent = document.createElement('div');
  // Add intro paragraphs
  introPs.forEach(p => {
    accordionContent.appendChild(p.cloneNode(true));
  });

  // Table (prefer .show-in-print, fallback to .hide-in-print)
  let table = accordionElement ? accordionElement.querySelector('.table.show-in-print') : null;
  if (!table && accordionElement) table = accordionElement.querySelector('.table.hide-in-print');
  if (table) accordionContent.appendChild(table.cloneNode(true));

  // Add any explanatory paragraphs after the tables (footnotes), skipping empty or duplicate 'Ulemper' labels
  if (accordionElement) {
    accordionElement.querySelectorAll('p').forEach(p => {
      const text = p.textContent.trim();
      if (text && text !== 'Ulemper' && !introPs.some(introP => introP.isSameNode(p))) {
        accordionContent.appendChild(p.cloneNode(true));
      }
    });
  }

  const rows = [headerRow];
  if (toggler && accordionContent.childNodes.length) {
    rows.push([
      toggler.textContent.trim(),
      accordionContent
    ]);
  }

  // Create the block table and replace the element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
