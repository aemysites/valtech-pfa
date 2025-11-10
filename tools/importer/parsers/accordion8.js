/* global WebImporter */
export default function parse(element, { document }) {
  // Find heading and intro paragraph
  const heading = element.querySelector('h2, h1, h3, h4, h5, h6');
  const intro = Array.from(element.querySelectorAll('p')).find(
    p => !p.classList.contains('accordions__toggler') && p.textContent.trim()
  );

  // Find the accordion toggler (title) and content
  const toggler = element.querySelector('.accordions__toggler');
  const content = element.querySelector('.accordions__element');

  // Compose the accordion item row: title = toggler only, content = accordion content
  let accordionRow = null;
  if (toggler && content) {
    accordionRow = [toggler.cloneNode(true), content.cloneNode(true)];
  }

  // Build the table rows
  const headerRow = ['Accordion (accordion8)'];
  const rows = [headerRow];
  if (accordionRow) rows.push(accordionRow);

  // Prepend heading and intro above the table if present
  if (heading || intro) {
    const frag = document.createDocumentFragment();
    if (heading) frag.appendChild(heading.cloneNode(true));
    if (intro) frag.appendChild(intro.cloneNode(true));
    rows.splice(1, 0, [frag, '']);
  }

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
