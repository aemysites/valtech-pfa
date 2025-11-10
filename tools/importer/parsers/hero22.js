/* global WebImporter */
export default function parse(element, { document }) {
  // HERO (hero22) block: 1 column, 3 rows
  // 1st row: block name
  // 2nd row: background image (none in this case)
  // 3rd row: heading, subheading, CTA, and ALL text content (including accordion content)

  // 1. HEADER ROW
  const headerRow = ['Hero (hero22)'];

  // 2. BACKGROUND IMAGE ROW (none in this source)
  const imageRow = [''];

  // 3. CONTENT ROW
  // Find the main content container (the innermost .col-sm-12)
  const col = element.querySelector('.col-sm-12');
  if (!col) return;

  // Heading
  const heading = col.querySelector('h2');

  // The first <p> is the subheading and contains the toggler and accordion content
  const firstP = col.querySelector('p');
  let subheading = '';
  let cta = '';
  let accordionText = '';
  if (firstP) {
    // Subheading: remove toggler and accordion for clean paragraph
    const pClone = firstP.cloneNode(true);
    Array.from(pClone.querySelectorAll('.accordions__toggler, .accordion__element')).forEach(el => el.remove());
    subheading = pClone;
    // CTA: get the visible toggler text ("Læs mere")
    const ctaEl = firstP.querySelector('.accordions__toggler .more');
    if (ctaEl) {
      cta = document.createElement('span');
      cta.textContent = ctaEl.textContent;
    }
    // Accordion: get all text from the accordion element
    const accordionEl = firstP.querySelector('.accordion__element');
    if (accordionEl) {
      accordionText = document.createElement('div');
      accordionText.textContent = accordionEl.textContent;
    }
  }

  // Compose the content cell: heading, subheading, CTA, accordion text
  const contentCell = [];
  if (heading) contentCell.push(heading.cloneNode(true));
  if (subheading) contentCell.push(subheading);
  if (cta) contentCell.push(cta);
  if (accordionText) contentCell.push(accordionText);

  // Table rows
  const rows = [
    headerRow,
    imageRow,
    [contentCell]
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
