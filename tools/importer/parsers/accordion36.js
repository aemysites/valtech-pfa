/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block parsing for Accordion (accordion36)
  // 1. Find all toggler elements and their corresponding content panels
  // 2. Build a table with the required header and rows

  const headerRow = ['Accordion (accordion36)']; // CRITICAL: Use block name as header
  const rows = [headerRow];

  // Find all toggler elements in order that are direct children of the main accordion block
  // Only top-level accordions (not nested togglers)
  // They are visually shown in the screenshot and are not nested under another toggler
  // We'll select only those togglers whose parent does NOT have the .accordions__element class
  const togglers = Array.from(element.querySelectorAll('.accordions__toggler'))
    .filter(toggler => !toggler.parentElement.classList.contains('accordions__element'));

  togglers.forEach((toggler) => {
    // The content is the next sibling .accordions__element
    let content = toggler.nextElementSibling;
    if (!content || !content.classList.contains('accordions__element')) return;
    rows.push([toggler.textContent.trim(), content]);
  });

  // Only create table if we have at least one accordion item
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
