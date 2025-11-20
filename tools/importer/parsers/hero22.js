/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Hero (hero22)'];

  // --- Row 2: Background image (none in this case) ---
  const imageRow = [''];

  // --- Row 3: Content (heading, paragraph, CTA, and ALL accordion content) ---
  const contentCol = element.querySelector('.col-sm-12') || element;

  // Find heading
  const heading = contentCol.querySelector('h2');

  // Find all paragraphs
  const paragraphs = Array.from(contentCol.querySelectorAll('p'));

  // Find the first paragraph with visible text (not the accordion/toggler)
  let mainParagraph = null;
  let accordionContent = null;
  let cta = null;
  for (const p of paragraphs) {
    // Find CTA ('Læs mere')
    const toggler = p.querySelector('.accordions__toggler .more');
    if (toggler && !cta) {
      cta = document.createElement('a');
      cta.textContent = toggler.textContent;
      cta.href = '#';
      cta.style.color = 'red';
    }
    // Find accordion content
    const accordion = p.querySelector('.accordion__element');
    if (accordion && !accordionContent) {
      accordionContent = accordion.cloneNode(true);
    }
    // Find main paragraph
    if (!mainParagraph) {
      const pClone = p.cloneNode(true);
      const togglerEl = pClone.querySelector('.accordions__toggler');
      if (togglerEl) togglerEl.remove();
      const accordionEl = pClone.querySelector('.accordion__element');
      if (accordionEl) accordionEl.remove();
      if (pClone.textContent.trim()) {
        mainParagraph = pClone;
      }
    }
  }

  // Compose all content for row 3
  const contentElements = [];
  if (heading) contentElements.push(heading);
  if (mainParagraph) contentElements.push(mainParagraph);
  if (cta) contentElements.push(cta);
  if (accordionContent) contentElements.push(accordionContent);

  const contentRow = [contentElements];

  // Build the table
  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the new block table
  element.replaceWith(table);
}
