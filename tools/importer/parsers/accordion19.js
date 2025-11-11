/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content column
  const mainCol = element.querySelector('.col-sm-12');
  if (!mainCol) return;

  // Accordion title: Prefer .accordions__toggler, fallback to visible h2
  let title = mainCol.querySelector('.accordions__toggler');
  if (!title) {
    title = mainCol.querySelector('h2:not([style*="display:none"])');
  }
  if (!title) {
    title = mainCol.querySelector('h2');
  }

  // Accordion content
  const content = mainCol.querySelector('.accordions__element');

  // CTA button (outside accordion, but visually grouped)
  const ctaDiv = element.querySelector('.col-xs-12');
  const cta = ctaDiv ? ctaDiv.querySelector('a.cta-btn') : null;

  // Build table rows
  const headerRow = ['Accordion (accordion19)'];
  const rows = [];

  if (title && content) {
    // Compose content cell: content + CTA if present
    const contentCell = document.createElement('div');
    contentCell.appendChild(content);
    if (cta) contentCell.appendChild(cta);
    rows.push([title, contentCell]);
  }

  // Create table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  element.replaceWith(table);
}
