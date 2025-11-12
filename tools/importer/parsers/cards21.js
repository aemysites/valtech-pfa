/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards21) block parsing
  const headerRow = ['Cards (cards21)'];
  const rows = [headerRow];

  // Find all card containers (teasers)
  const cardContainers = Array.from(element.querySelectorAll('.teasers__teaser'));

  cardContainers.forEach(card => {
    // --- IMAGE CELL ---
    // Include ALL images (background + icon) in the cell, as per validation feedback
    const imgs = Array.from(card.querySelectorAll('img'));
    const imageCell = imgs.length ? imgs : '';

    // --- TEXT CELL ---
    // Title (h3)
    const title = card.querySelector('h3');
    // Description: all <p> except those that only contain toggler/accordion elements
    const paragraphs = Array.from(card.querySelectorAll('p'));
    const descParas = paragraphs.filter(p => {
      const toggler = p.querySelector('.accordions__toggler, .accordion__element');
      return !(
        p.childNodes.length === 1 && toggler
      );
    });
    const descElements = descParas.map(p => p);

    // Call-to-action: Only use a real <a> link as CTA if present
    let ctaLink = null;
    const links = Array.from(card.querySelectorAll('a'));
    if (links.length) {
      ctaLink = links[links.length - 1]; // usually the last link is CTA
    }
    // Do NOT fabricate a CTA from toggler text

    // Compose text cell: [title, ...descElements, ctaLink]
    const textCellContent = [];
    if (title) textCellContent.push(title);
    descElements.forEach(e => textCellContent.push(e));
    if (ctaLink) textCellContent.push(ctaLink);

    rows.push([
      imageCell,
      textCellContent
    ]);
  });

  // Create and replace block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
