/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block: extract accordion items (title + content)
  const headerRow = ['Accordion (accordion8)'];
  const rows = [headerRow];

  // Get the main heading and intro paragraph
  const h2 = element.querySelector('h2');
  const introP = h2 ? h2.nextElementSibling : null;

  // Find the accordion toggler and its content container
  const toggler = element.querySelector('.accordions__toggler');
  const accordionContent = element.querySelector('.accordions__element');

  if (toggler && accordionContent) {
    // Prefer the 'show-in-print' table if present, else any table
    let table = accordionContent.querySelector('.show-in-print') || accordionContent.querySelector('table');
    // Get any footnote paragraphs inside accordionContent (those with '*')
    const footnotes = Array.from(accordionContent.querySelectorAll('p')).filter(p => p.textContent.trim().startsWith('*'));
    const contentCell = document.createElement('div');
    if (table) contentCell.appendChild(table.cloneNode(true));
    footnotes.forEach(fn => contentCell.appendChild(fn.cloneNode(true)));
    rows.push([
      document.createTextNode(toggler.textContent.trim()),
      contentCell
    ]);
  }

  // Create a fragment to hold heading/intro and the block
  const fragment = document.createDocumentFragment();
  if (h2) fragment.appendChild(h2.cloneNode(true));
  if (introP) fragment.appendChild(introP.cloneNode(true));
  const block = WebImporter.DOMUtils.createTable(rows, document);
  fragment.appendChild(block);
  element.replaceWith(fragment);
}
