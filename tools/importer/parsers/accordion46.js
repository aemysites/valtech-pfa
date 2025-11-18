/* global WebImporter */
export default function parse(element, { document }) {
  // Find the first visible h2 (heading)
  const heading = Array.from(element.querySelectorAll('h2')).find(h2 => h2.style.display !== 'none');

  // Collect all intro paragraphs before the first accordion toggler
  const introParagraphs = [];
  for (const child of element.children) {
    if (child.classList.contains('accordions__toggler')) break;
    if ((child.tagName === 'P' || child.tagName === 'BR') && child.textContent.trim()) {
      introParagraphs.push(child);
    }
  }

  // Find all accordion toggler paragraphs and their content blocks
  const togglers = Array.from(element.querySelectorAll('.accordions__toggler'));
  const accordionRows = [];
  togglers.forEach(toggler => {
    // Find the next sibling with class 'accordions__element'
    let content = toggler.nextElementSibling;
    if (!content || !content.classList.contains('accordions__element')) {
      content = null;
      let sib = toggler;
      while ((sib = sib.nextElementSibling)) {
        if (sib.classList && sib.classList.contains('accordions__element')) {
          content = sib;
          break;
        }
        if (sib.classList && sib.classList.contains('accordions__toggler')) break;
      }
    }
    if (!content) content = document.createElement('div');
    accordionRows.push([toggler, content]);
  });

  // Build the table cells
  const cells = [];
  // Header row
  cells.push(['Accordion (accordion46)']);
  // Add intro row as first accordion item (title cell: heading, content cell: intro paragraphs)
  if (heading || introParagraphs.length) {
    const introFrag = document.createDocumentFragment();
    introParagraphs.forEach(p => introFrag.appendChild(p.cloneNode(true)));
    cells.push([heading ? heading.cloneNode(true) : '', introFrag]);
  }
  // Accordion items
  accordionRows.forEach(([title, content]) => {
    cells.push([title, content]);
  });

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
