/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion title
  let accordionTitle = '';
  const toggler = element.querySelector('.accordions__toggler');
  if (toggler) {
    accordionTitle = toggler.textContent.trim();
  }

  // Find the accordion content
  const accordionContent = element.querySelector('.accordions__element');

  // Find CTA button (outside accordion)
  let cta = null;
  const ctaDiv = element.querySelector('.col-xs-12.text-center');
  if (ctaDiv) {
    cta = ctaDiv.querySelector('a');
  }

  // Table header
  const headerRow = ['Accordion (accordion19)'];
  // Table body: one accordion item (title, content)
  const rows = [headerRow, [accordionTitle, [accordionContent, cta].filter(Boolean)]];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
