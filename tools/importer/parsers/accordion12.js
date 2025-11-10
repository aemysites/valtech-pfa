/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion12)'];

  // Find all toggler elements (accordion triggers)
  const togglers = Array.from(element.querySelectorAll('.accordions__toggler'));
  // Find all accordion content elements (should match toggler count)
  const accordionElements = Array.from(element.querySelectorAll('.accordions__element'));

  // Defensive: only pair as many as exist in both arrays
  const rowCount = Math.min(togglers.length, accordionElements.length);

  // Build rows: each row is [title, content]
  const rows = [];
  for (let i = 0; i < rowCount; i++) {
    // Title cell: use the toggler element (preserves text and formatting)
    const titleCell = togglers[i];
    // Content cell: use the corresponding accordion content element
    const contentCell = accordionElements[i];
    rows.push([titleCell, contentCell]);
  }

  // Compose the table data
  const tableData = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element
  element.replaceWith(block);
}
