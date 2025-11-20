/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards101) block: 2 columns, header row, each card: image/icon | text content (title, description, CTA)
  const headerRow = ['Cards (cards101)'];
  const rows = [headerRow];

  // Find the parent row containing all cards
  const cardRow = element.querySelector('.row.teasers .row');
  if (!cardRow) return;

  // Select all card columns
  const cardCols = cardRow.querySelectorAll('.col-sm-4');

  cardCols.forEach((col) => {
    // Each card's main container
    const teaser = col.querySelector('.teasers__teaser');
    if (!teaser) return;

    // Image/Icon (mandatory)
    const img = teaser.querySelector('img');

    // Title (h3)
    const title = teaser.querySelector('h3');

    // Description (first p after teaser OR first p in col not inside .read-more)
    let description = null;
    // Try to find the first <p> after teaser
    let next = teaser.nextElementSibling;
    while (next) {
      if (next.tagName === 'P') {
        description = next;
        break;
      }
      next = next.nextElementSibling;
    }
    // If not found, try to find the first <p> in col that is not inside .read-more
    if (!description) {
      const ps = Array.from(col.querySelectorAll('p'));
      description = ps.find(p => !p.closest('.read-more'));
    }

    // Expanded content (accordion__element)
    let expanded = null;
    const accordion = col.querySelector('.accordion__element');
    if (accordion) expanded = accordion;

    // Call-to-action (CTA): find the first .read-more link
    let cta = null;
    const readMore = col.querySelector('.read-more');
    if (readMore) {
      const toggler = readMore.querySelector('.accordions__toggler .more');
      if (toggler) {
        cta = document.createElement('a');
        cta.href = '#';
        cta.textContent = toggler.textContent.trim();
        cta.style.color = '#c00';
      }
    }

    // Compose text cell: title, description, expanded, CTA
    const textCell = [];
    if (title) textCell.push(title);
    if (description) textCell.push(description);
    if (expanded) textCell.push(expanded);
    if (cta) textCell.push(cta);

    rows.push([
      img ? img : '',
      textCell
    ]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
