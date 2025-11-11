/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion31)'];

  // Find the main heading (context for the block)
  const heading = element.querySelector('h5');

  // Find all toggler elements (accordion triggers)
  const togglers = Array.from(element.querySelectorAll('.accordions__toggler'));

  // Find all accordion content blocks
  const accordionContents = Array.from(element.querySelectorAll('.accordions__element'));

  // Defensive: Only pair togglers and content if they are matched
  const rows = [];
  for (let i = 0; i < togglers.length; i++) {
    const titleCell = togglers[i];
    const contentCell = accordionContents[i] || document.createElement('div');
    rows.push([titleCell, contentCell]);
  }

  // Compose the final table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // If a heading exists, insert it before the block for context
  if (heading) {
    element.parentNode.insertBefore(heading, element);
  }

  // Replace the original element with the block table
  element.replaceWith(block);
}
