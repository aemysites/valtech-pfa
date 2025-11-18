/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main container
  const mainDiv = element.querySelector('.col-sm-12');

  // Find heading (visible h2)
  let heading = null;
  const h2s = mainDiv.querySelectorAll('h2');
  for (const h2 of h2s) {
    if (h2.style.display !== 'none') {
      heading = h2;
      break;
    }
  }

  // Gather intro paragraphs (before accordions)
  const introParas = [];
  const allPs = Array.from(mainDiv.querySelectorAll('p'));
  for (const p of allPs) {
    if (p.classList.contains('accordions__toggler')) break;
    introParas.push(p);
  }

  // Find CTA button (at the bottom)
  let ctaCell = null;
  const ctaDiv = mainDiv.querySelector('.col-xs-12.text-center');
  if (ctaDiv) {
    const a = ctaDiv.querySelector('a');
    if (a) ctaCell = a;
  }

  // Build accordion rows
  const rows = [];
  // Header row
  rows.push(['Accordion (accordion37)']);

  // First row: heading and intro paragraphs and CTA button
  const leftCell = [];
  if (heading) leftCell.push(heading);
  if (introParas.length) leftCell.push(...introParas);
  if (ctaCell) leftCell.push(ctaCell);
  if (leftCell.length) {
    rows.push([leftCell, '']);
  }

  // Accordion items
  const togglers = Array.from(mainDiv.querySelectorAll('p.accordions__toggler'));
  togglers.forEach((toggler) => {
    // Find the next sibling .accordions__element
    let contentDiv = toggler.nextElementSibling;
    while (contentDiv && !contentDiv.classList.contains('accordions__element')) {
      contentDiv = contentDiv.nextElementSibling;
    }
    if (contentDiv) {
      rows.push([toggler, contentDiv]);
    }
  });

  // Create block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(table);
}
