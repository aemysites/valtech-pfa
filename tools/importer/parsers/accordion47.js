/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header as required: single cell, not <th>
  const headerRow = ['Accordion (accordion47)'];

  // Find all accordion items (columns)
  const cols = Array.from(element.querySelectorAll(':scope > .col-xs-12.col-sm-6'));
  if (!cols.length) return;

  // Each column contains .teasers__teaser
  // Inside .teasers__teaser: toggler (title) and element (content)
  const rows = cols.map((col) => {
    const teaser = col.querySelector('.teasers__teaser');
    if (!teaser) return null;
    // Title: .accordions__toggler (extract only text, not the element)
    const titleEl = teaser.querySelector('.accordions__toggler');
    const title = titleEl ? titleEl.textContent.trim() : '';
    // Content: .accordions__element (keep full element)
    const content = teaser.querySelector('.accordions__element') || '';
    return [title, content];
  }).filter(Boolean);

  // Table: header + all rows
  const tableCells = [headerRow, ...rows];

  // Create table block
  const block = WebImporter.DOMUtils.createTable(tableCells, document);

  // Replace original element
  element.replaceWith(block);
}
