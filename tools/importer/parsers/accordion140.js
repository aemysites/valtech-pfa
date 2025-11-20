/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion140)'];
  const rows = [headerRow];

  // Only include the accordion items (no heading/footer rows)
  const togglers = Array.from(element.querySelectorAll('p.accordions__toggler'));
  togglers.forEach((toggler) => {
    // Title cell: just the text
    const titleCell = toggler.textContent.trim();
    // Content cell: next sibling .accordions__element
    let contentCell = '';
    let next = toggler.nextElementSibling;
    if (next && next.classList.contains('accordions__element')) {
      contentCell = document.createElement('div');
      Array.from(next.childNodes).forEach((node) => {
        contentCell.appendChild(node.cloneNode(true));
      });
    }
    rows.push([titleCell, contentCell]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
