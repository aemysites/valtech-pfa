/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Cards (cards92)'];

  // Helper to extract card content from a column
  function extractCard(col) {
    // Find the teaser container
    const teaser = col.querySelector('.teasers__teaser');
    if (!teaser) return null;

    // Image/Icon (mandatory)
    const img = teaser.querySelector('img');

    // Title (h3)
    const title = teaser.querySelector('h3');

    // Description (first p not inside .read-more)
    let description = null;
    const ps = Array.from(teaser.querySelectorAll('p'));
    for (const p of ps) {
      if (!p.closest('.read-more')) {
        description = p;
        break;
      }
    }

    // Call-to-Action (CTA): 'Læs mere' link
    let cta = null;
    const readMore = teaser.querySelector('.read-more');
    if (readMore) {
      // Find the toggler paragraph
      const toggler = readMore.querySelector('.accordions__toggler');
      if (toggler) {
        // Find the 'Læs mere' span
        const moreSpan = toggler.querySelector('.more');
        if (moreSpan) {
          // Create a link element for CTA
          cta = document.createElement('a');
          cta.href = '#';
          cta.textContent = moreSpan.textContent.trim();
          cta.style.color = '#c00'; // Optional: mimic red style
        }
      }
    }

    // Expanded content (accordion__element)
    let expanded = null;
    if (readMore) {
      const accordionContent = readMore.querySelector('.accordion__element');
      if (accordionContent) {
        expanded = accordionContent;
      }
    }

    // Compose the text cell
    const textCell = [];
    if (title) textCell.push(title);
    if (description) textCell.push(description);
    if (cta) textCell.push(cta);
    if (expanded) textCell.push(expanded);

    return [img, textCell];
  }

  // Find all card columns
  const cardCols = Array.from(element.querySelectorAll('.col-xs-12.col-sm-4'));
  const rows = cardCols
    .map(extractCard)
    .filter(Boolean);

  // Compose the table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
