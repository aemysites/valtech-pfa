/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion10)'];
  const rows = [headerRow];

  // Find all toggler and content pairs
  const togglers = Array.from(element.querySelectorAll('p.accordions__toggler'));
  togglers.forEach((toggler) => {
    // Find the next sibling that is an accordion content element
    let content = toggler.nextElementSibling;
    while (content && !content.classList.contains('accordions__element')) {
      content = content.nextElementSibling;
    }
    // Title cell: just the text content
    const titleText = toggler.textContent.trim();
    // Content cell: the inner HTML/content of the accordion element
    let contentCell;
    if (content) {
      contentCell = document.createElement('div');
      Array.from(content.childNodes).forEach((node) => {
        contentCell.appendChild(node.cloneNode(true));
      });
    } else {
      contentCell = '';
    }
    rows.push([titleText, contentCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the block table
  element.replaceWith(block);
}
