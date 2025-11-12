/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion (accordion13) block
  const headerRow = ['Accordion (accordion13)'];
  const rows = [headerRow];

  // Find the accordion toggler/title (always reference the real element)
  const titleEl = element.querySelector('.accordions__toggler');
  let titleCell = '';
  if (titleEl) {
    titleCell = titleEl;
  } else {
    // Fallback: Try to find first <p> inside
    const fallbackTitle = element.querySelector('p');
    titleCell = fallbackTitle ? fallbackTitle : '';
  }

  // Find the accordion content (reference the real element)
  // In this screenshot, the accordion is collapsed, so no content is visible
  // But in the HTML, the content is present in the following sibling div
  let contentCell = '';
  const elementDiv = element.querySelector('.accordions__element');
  if (elementDiv) {
    contentCell = elementDiv;
  } else {
    // Fallback: Try to find first <div> inside
    const fallbackContent = element.querySelector('div');
    contentCell = fallbackContent ? fallbackContent : '';
  }

  // Add the accordion item row
  rows.push([titleCell, contentCell]);

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
