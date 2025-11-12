/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion35)'];
  const rows = [headerRow];

  // Find all toggler and content pairs
  // The structure is: toggler <p> followed by .accordions__element
  const togglers = Array.from(element.querySelectorAll('.accordions__toggler'));
  const elements = Array.from(element.querySelectorAll('.accordions__element'));

  // Defensive: ensure pairs
  const count = Math.min(togglers.length, elements.length);
  for (let i = 0; i < count; i++) {
    const title = togglers[i];
    const content = elements[i];

    // For the content cell, extract the inner .row (which contains the actual content)
    const row = content.querySelector('.row');
    // Defensive: if no .row, fallback to content itself
    const contentCell = row ? row : content;

    rows.push([title, contentCell]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(table);
}
