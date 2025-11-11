/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block extraction for Accordion (accordion35)
  // Header row must match block name exactly
  const headerRow = ['Accordion (accordion35)'];
  const rows = [headerRow];

  // Find all toggler elements (accordion headers)
  const togglers = Array.from(element.querySelectorAll('p.accordions__toggler'));
  togglers.forEach((toggler) => {
    // The content is the next sibling with class 'accordions__element'
    let content = toggler.nextElementSibling;
    if (!content || !content.classList.contains('accordions__element')) return;

    // Title cell: reference the toggler element itself
    const titleCell = toggler;

    // Content cell: extract the inner structure
    let contentCell;
    const row = content.querySelector('.row');
    if (row) {
      // Find left and right columns
      const leftCol = row.querySelector('.col-sm-8');
      const rightCol = row.querySelector('.col-sm-4');
      // Defensive: if both columns exist, combine their teasers
      if (leftCol && rightCol) {
        // Reference teasers, not clone or create
        const leftTeaser = leftCol.querySelector('.teasers__teaser') || leftCol;
        const rightTeaser = rightCol.querySelector('.teasers__teaser') || rightCol;
        contentCell = document.createElement('div');
        contentCell.appendChild(leftTeaser);
        contentCell.appendChild(rightTeaser);
      } else {
        // Fallback: use row itself
        contentCell = row;
      }
    } else {
      // Fallback: use content itself
      contentCell = content;
    }
    rows.push([titleCell, contentCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
