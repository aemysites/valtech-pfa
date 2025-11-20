/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract teaser column
  function extractColumn(col) {
    const cellContent = [];
    // Image (always present)
    const img = col.querySelector('.teasers__teaser img');
    if (img) cellContent.push(img);
    // Quote (right of image)
    const quoteTeaser = col.querySelector('.col-sm-4 .teasers__teaser p');
    if (quoteTeaser) cellContent.push(quoteTeaser);
    // Accordion toggler (below image/quote)
    const toggler = col.querySelector('.accordions__toggler');
    if (toggler) cellContent.push(toggler);
    // Accordion content (below toggler)
    const accordion = col.querySelector('.accordions__element .teasers__teaser');
    if (accordion) {
      // Only include direct children (paragraphs, lists)
      Array.from(accordion.children).forEach((child) => {
        if (child.tagName === 'P' || child.tagName === 'UL' || child.tagName === 'OL') {
          cellContent.push(child);
        }
      });
    }
    return cellContent;
  }

  // Top-level columns (two)
  let columns = Array.from(element.querySelectorAll(':scope > div > div > div > div.row > div.col-sm-6'));

  // Defensive: fallback if columns not found
  if (columns.length !== 2) {
    columns = Array.from(element.querySelectorAll('.col-sm-6'));
  }

  // Compose table rows
  const headerRow = ['Columns (columns102)'];
  const contentRow = columns.map(extractColumn);

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace original element
  element.replaceWith(table);
}
