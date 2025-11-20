/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Accordion (accordion35)'];
  const rows = [headerRow];

  // Find all accordion toggler titles and their content
  const togglers = Array.from(element.querySelectorAll('.accordions__toggler'));
  togglers.forEach((toggler) => {
    // The content block is the next sibling with class 'accordions__element'
    let content = toggler.nextElementSibling;
    if (!content || !content.classList.contains('accordions__element')) {
      // Defensive: fallback to searching for the next matching element
      content = Array.from(element.querySelectorAll('.accordions__element')).find(
        (el) => el.previousElementSibling === toggler
      );
    }
    if (!content) return;

    // Title cell: extract plain text only
    const titleText = toggler.textContent.trim();

    // Content cell: flatten and combine all relevant content from both columns
    // Find both .col-xs-12.col-sm-8 and .col-xs-12.col-sm-4 inside the content
    const leftCol = content.querySelector('.col-xs-12.col-sm-8');
    const rightCol = content.querySelector('.col-xs-12.col-sm-4');
    const cellContent = document.createElement('div');
    if (leftCol) {
      Array.from(leftCol.childNodes).forEach((node) => {
        cellContent.appendChild(node.cloneNode(true));
      });
    }
    if (rightCol) {
      Array.from(rightCol.childNodes).forEach((node) => {
        cellContent.appendChild(node.cloneNode(true));
      });
    }
    rows.push([titleText, cellContent]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the new block table
  element.replaceWith(table);
}
