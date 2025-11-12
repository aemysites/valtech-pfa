/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero22) block parsing
  // Table: 1 column, 3 rows
  // Row 1: Block name
  // Row 2: Background image (none in this case)
  // Row 3: Heading, subheading, CTA, and ALL text content (including expandable accordion content)

  const mainCol = element.querySelector('.col-sm-12');
  const contentRoot = mainCol || element;

  // Find heading (h2)
  const heading = contentRoot.querySelector('h2');

  // Find all paragraphs
  const paragraphs = Array.from(contentRoot.querySelectorAll('p'));

  // Subheading: first <p> only
  let subheading = null;
  if (paragraphs.length) {
    subheading = paragraphs[0];
  }

  // Find CTA toggler ('Læs mere') and format as a link
  let cta = null;
  let expandableContent = null;
  for (const p of paragraphs) {
    const togglerSpan = p.querySelector('.accordions__toggler .more');
    if (togglerSpan && !cta) {
      cta = document.createElement('a');
      cta.textContent = togglerSpan.textContent;
      cta.href = '#'; // No actual link in source, so use placeholder
      cta.style.color = 'red'; // Optional: preserve visual hint
    }
    const accordionContent = p.querySelector('.accordion__element');
    if (accordionContent && !expandableContent) {
      expandableContent = accordionContent.cloneNode(true);
    }
  }

  // Compose content for row 3: heading, summary, CTA link, and expandable accordion content
  const row3Content = [];
  if (heading) row3Content.push(heading);
  if (subheading) row3Content.push(subheading);
  if (cta) row3Content.push(cta);
  if (expandableContent) row3Content.push(expandableContent);

  // Table rows
  const headerRow = ['Hero (hero22)'];
  const imageRow = ['']; // No image in this block
  const contentRow = [row3Content];

  const cells = [headerRow, imageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
