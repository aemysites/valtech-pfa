/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero22) block: 1 column, 3 rows
  // Row 1: Block name
  // Row 2: Background image (optional, not present here)
  // Row 3: Heading, subheading, ALL text content (including accordion content)

  // Find heading (h2)
  const heading = element.querySelector('h2');

  // Find paragraphs
  const paragraphs = Array.from(element.querySelectorAll('p'));

  // Find CTA (visible 'Læs mere' text)
  let cta = null;
  const togglerMore = element.querySelector('.accordions__toggler .more');
  if (togglerMore) {
    const a = document.createElement('a');
    a.textContent = togglerMore.textContent;
    a.href = '#'; // No actual href in source, so use '#'
    a.style.color = 'red';
    cta = a;
  }

  // Find accordion content (all text inside .accordion__element)
  const accordionContent = element.querySelector('.accordion__element');

  // Compose content for row 3 (heading, paragraph, accordion content, CTA)
  const contentRow = [];
  if (heading) contentRow.push(heading);

  if (paragraphs.length > 0) {
    // Remove toggler and accordion content from paragraph
    const p = paragraphs[0].cloneNode(true);
    Array.from(p.querySelectorAll('.accordions__toggler, .accordion__element')).forEach(e => e.remove());
    if (p.textContent.trim()) contentRow.push(p);
  }

  if (accordionContent) {
    contentRow.push(accordionContent.cloneNode(true));
  }

  if (cta) contentRow.push(cta);

  // Table rows
  const headerRow = ['Hero (hero22)'];
  const imageRow = ['']; // No image in this block
  const textRow = [contentRow];

  const cells = [headerRow, imageRow, textRow];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
