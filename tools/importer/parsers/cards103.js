/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards103) block: 2 columns, each row is a card
  // Header row
  const headerRow = ['Cards (cards103)'];

  // Find all card containers (teasers__teaser)
  const cardEls = element.querySelectorAll('.teasers__teaser');
  const rows = [];

  cardEls.forEach((cardEl) => {
    // --- COLUMN 1: Image ---
    const img = cardEl.querySelector('img');
    const imageCell = img ? img : '';

    // --- COLUMN 2: Text Content ---
    // Title: first heading (h3, h2, etc)
    let titleEl = cardEl.querySelector('h3, h2, h4, h5, h6');
    if (!titleEl) titleEl = cardEl.querySelector('strong, b');

    // Description: all <p> except those with class 'accordions__toggler', those containing only the image, and those inside .accordions__element
    const descPs = Array.from(cardEl.querySelectorAll('p')).filter(p => {
      if (p.classList.contains('accordions__toggler')) return false;
      if (p.querySelector('img')) return false;
      // Exclude paragraphs that are inside the accordion element
      if (p.closest('.accordions__element')) return false;
      return true;
    });
    const descFrag = document.createDocumentFragment();
    descPs.forEach(p => descFrag.appendChild(p.cloneNode(true)));

    // CTA: find <p> with class 'accordions__toggler'
    let ctaEl = cardEl.querySelector('p.accordions__toggler');
    if (!ctaEl) ctaEl = cardEl.querySelector('button, a');

    // Accordion content: look for .accordions__element inside the card
    const accordionEl = cardEl.querySelector('.accordions__element');
    let accordionFrag = null;
    if (accordionEl) {
      accordionFrag = document.createDocumentFragment();
      Array.from(accordionEl.children).forEach(child => {
        accordionFrag.appendChild(child.cloneNode(true));
      });
    }

    // Compose the text cell: title, description, CTA, accordion content (no duplication)
    const textCell = document.createDocumentFragment();
    if (titleEl) textCell.appendChild(titleEl.cloneNode(true));
    if (descFrag.childNodes.length > 0) textCell.appendChild(descFrag);
    if (ctaEl) textCell.appendChild(ctaEl.cloneNode(true));
    if (accordionFrag && accordionFrag.childNodes.length > 0) textCell.appendChild(accordionFrag);

    rows.push([imageCell, textCell]);
  });

  // If no .teasers__teaser found, try to parse as a single card
  if (rows.length === 0) {
    const img = element.querySelector('img');
    let titleEl = element.querySelector('h3, h2, h4, h5, h6');
    if (!titleEl) titleEl = element.querySelector('strong, b');
    const descPs = Array.from(element.querySelectorAll('p')).filter(p => {
      if (p.classList.contains('accordions__toggler')) return false;
      if (p.querySelector('img')) return false;
      if (p.closest('.accordions__element')) return false;
      return true;
    });
    const descFrag = document.createDocumentFragment();
    descPs.forEach(p => descFrag.appendChild(p.cloneNode(true)));
    let ctaEl = element.querySelector('p.accordions__toggler');
    if (!ctaEl) ctaEl = element.querySelector('button, a');
    const accordionEl = element.querySelector('.accordions__element');
    let accordionFrag = null;
    if (accordionEl) {
      accordionFrag = document.createDocumentFragment();
      Array.from(accordionEl.children).forEach(child => {
        accordionFrag.appendChild(child.cloneNode(true));
      });
    }
    const textCell = document.createDocumentFragment();
    if (titleEl) textCell.appendChild(titleEl.cloneNode(true));
    if (descFrag.childNodes.length > 0) textCell.appendChild(descFrag);
    if (ctaEl) textCell.appendChild(ctaEl.cloneNode(true));
    if (accordionFrag && accordionFrag.childNodes.length > 0) textCell.appendChild(accordionFrag);
    rows.push([img ? img : '', textCell]);
  }

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace original element
  element.replaceWith(table);
}
