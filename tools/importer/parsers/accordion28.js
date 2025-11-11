/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion28)'];

  // Find all toggler elements (accordion headers)
  const rows = [];
  const togglers = Array.from(element.querySelectorAll('.accordions__toggler'));
  togglers.forEach((toggler) => {
    // Find the next sibling that is the accordion content
    let content = toggler.nextElementSibling;
    if (content && content.classList.contains('accordions__element')) {
      let contentDiv = content.querySelector('div');
      let contentEl = contentDiv ? contentDiv : content;
      rows.push([toggler, contentEl]);
    }
  });

  // Compose table data: header row, then only accordion items
  const tableData = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);
  element.replaceWith(block);
}
