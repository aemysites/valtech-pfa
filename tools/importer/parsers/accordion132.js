/* global WebImporter */
export default function parse(element, { document }) {
  // Find section headings
  const sectionHeadings = Array.from(element.querySelectorAll('h5'));

  // Helper to extract accordion rows for a section
  function getAccordionRows(startElem, endElem) {
    const rows = [];
    let node = startElem.nextElementSibling;
    while (node && node !== endElem) {
      if (node.matches('p.accordions__toggler')) {
        const content = node.nextElementSibling;
        if (content && content.classList.contains('accordions__element')) {
          rows.push([node, content]);
        }
      }
      node = node.nextElementSibling;
    }
    return rows;
  }

  // Only create tables for sections that have accordion items
  sectionHeadings.forEach((heading, i) => {
    const nextHeading = sectionHeadings[i + 1] || null;
    const accordionRows = getAccordionRows(heading, nextHeading);
    if (accordionRows.length) {
      const headerRow = ['Accordion (accordion132)'];
      const rows = [headerRow];
      // Add section heading as a row (spanning both columns)
      const headingCell = document.createElement('strong');
      headingCell.textContent = heading.textContent.trim();
      rows.push([headingCell, '']);
      rows.push(...accordionRows);
      const table = WebImporter.DOMUtils.createTable(rows, document);
      element.parentNode.insertBefore(table, element);
    }
  });
  element.remove();
}
