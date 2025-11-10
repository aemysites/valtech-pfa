/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards21) block: 2 columns, multiple rows, each card = [image/icon, text content]
  // Header row
  const headerRow = ['Cards (cards21)'];
  const rows = [headerRow];

  // Find all card columns (each .col-xs-12.col-sm-4 is a card)
  const cardColumns = element.querySelectorAll('.col-xs-12.col-sm-4');

  cardColumns.forEach((col) => {
    // Each card
    const teaser = col.querySelector('.teasers__teaser');
    if (!teaser) return;

    // --- IMAGE/ICON CELL ---
    // Find the main icon/image (ignore background image)
    // The first img is a background, the second is the icon
    const imgs = teaser.querySelectorAll('img');
    let iconImg = null;
    if (imgs.length > 1) {
      iconImg = imgs[1];
    } else if (imgs.length === 1) {
      iconImg = imgs[0];
    }
    // Defensive: if no icon, fallback to first img
    const imageCell = iconImg || imgs[0] || '';

    // --- TEXT CELL ---
    const textContent = [];
    // Title (h3)
    const h3 = teaser.querySelector('h3');
    if (h3) textContent.push(h3);
    // Description (all <p> except those that are just CTA)
    // We'll include all <p> except those that only contain a link
    const ps = teaser.querySelectorAll('p');
    ps.forEach((p) => {
      // If p contains only a CTA link, skip for now (will add as CTA)
      const hasOnlyLink = p.childNodes.length === 1 && p.querySelector('a');
      if (!hasOnlyLink) {
        textContent.push(p);
      }
    });
    // CTA: find the first link in teaser (outside accordion toggler)
    let cta = null;
    // Try to find a direct <a> inside teaser
    const ctaLink = teaser.querySelector('a[href]');
    if (ctaLink) {
      cta = ctaLink;
    } else {
      // Fallback: look for .accordions__toggler or other toggler
      const toggler = teaser.querySelector('.accordions__toggler .more');
      if (toggler) cta = toggler;
    }
    if (cta) textContent.push(cta);

    rows.push([imageCell, textContent]);
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
