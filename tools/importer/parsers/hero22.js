/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero22) block parsing
  // 1 column, 3 rows: [Header], [Image], [Content]

  // Header row
  const headerRow = ['Hero (hero22)'];

  // Row 2: Background image (none in this case)
  const imageRow = [''];

  // Row 3: Content (heading, subheading, CTA, and ALL visible text)
  const contentContainer = element.querySelector('.col-sm-12') || element;

  const contentCell = [];

  // Heading
  const heading = contentContainer.querySelector('h2');
  if (heading) contentCell.push(heading.cloneNode(true));

  // Paragraph (subheading)
  const firstP = contentContainer.querySelector('p');
  if (firstP) {
    // Clone the paragraph for manipulation
    const para = firstP.cloneNode(true);
    // Remove toggler and accordion from the paragraph
    const toggler = para.querySelector('.accordions__toggler');
    if (toggler) toggler.remove();
    const accordion = para.querySelector('.accordion__element');
    if (accordion) accordion.remove();
    // Only add paragraph if it has text content
    if (para.textContent.trim()) contentCell.push(para);
    // Add CTA (Læs mere) if present
    const origToggler = firstP.querySelector('.accordions__toggler');
    if (origToggler) {
      const more = origToggler.querySelector('.more');
      if (more) {
        const cta = document.createElement('a');
        cta.href = '#';
        cta.textContent = more.textContent + ' ↓'; // add arrow as in screenshot
        contentCell.push(cta);
      }
    }
    // Do NOT add the accordion content (the expanded text)
    // Only visible content per screenshot and block description
  }

  // Build table
  const cells = [
    headerRow,
    imageRow,
    [contentCell]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
