/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block: 2 columns, multiple rows
  // Header row
  const headerRow = ['Accordion (accordion31)'];

  // Find all accordion toggler elements (titles)
  const togglerEls = Array.from(element.querySelectorAll('.accordions__toggler'));
  // Find all accordion content blocks
  const contentEls = Array.from(element.querySelectorAll('.accordions__element'));

  // Only pair toggler with content if both exist
  const rows = [];
  for (let i = 0; i < togglerEls.length; i++) {
    const titleEl = togglerEls[i];
    const contentEl = contentEls[i];
    if (!titleEl || !contentEl) continue;
    // Title cell: Use only the text content of the toggler
    // Content cell: Use the entire accordion content block
    rows.push([
      titleEl.textContent.trim(),
      contentEl
    ]);
  }

  // Compose table data
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
