/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main heading and intro paragraph
  let heading = null;
  let intro = null;
  // Find first h2 (visible)
  const h2s = element.querySelectorAll('h2');
  heading = Array.from(h2s).find(h => h.style.display !== 'none');
  // Find first paragraph after heading
  if (heading) {
    let next = heading.nextElementSibling;
    while (next && next.tagName !== 'P') {
      next = next.nextElementSibling;
    }
    intro = next;
  }

  // Accordion toggler paragraphs
  const togglers = element.querySelectorAll('p.accordions__toggler');
  // Accordion content blocks
  const elements = element.querySelectorAll('div.accordions__element');

  // Defensive: ensure same number of togglers and elements
  const rows = [];
  for (let i = 0; i < togglers.length && i < elements.length; i++) {
    // Title: extract plain text from toggler
    const titleText = togglers[i].textContent.trim();
    // Content: use the whole accordion content block
    const content = elements[i];
    rows.push([titleText, content]);
  }

  // Table header row
  const headerRow = ['Accordion (accordion122)'];

  // Compose table cells: header + accordion items only
  const cells = [
    headerRow,
    ...rows
  ];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Insert heading and intro above the accordion table if present
  if (heading) {
    element.parentNode.insertBefore(heading, element);
  }
  if (intro) {
    element.parentNode.insertBefore(intro, element);
  }

  // Replace original element
  element.replaceWith(block);
}
