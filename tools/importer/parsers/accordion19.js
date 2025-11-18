/* global WebImporter */
export default function parse(element, { document }) {
  // Compose table rows: header row is single cell array, data rows are arrays of two cells
  const headerRow = ['Accordion (accordion19)'];

  // Find the accordion toggler (title)
  const toggler = element.querySelector('.accordions__toggler') || element.querySelector('p');
  // Find the accordion content
  const content = element.querySelector('.accordions__element') || element.querySelector('div[class*="accordion"]');
  // Find the CTA button
  const cta = element.querySelector('.col-xs-12.text-center a');

  // Only include the header row and one accordion item row
  // The CTA must be included in the content cell array to ensure all text content is present
  const cells = [
    headerRow,
    [toggler, [content, cta].filter(Boolean)]
  ];

  // Create Accordion block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
