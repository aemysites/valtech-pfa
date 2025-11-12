/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion12)'];

  // Find the main section heading (first h5)
  const heading = element.querySelector('h5');

  // Find all toggler elements (accordion titles)
  const togglers = Array.from(element.querySelectorAll('.accordions__toggler'));
  // Find all accordion content elements
  const contents = Array.from(element.querySelectorAll('.accordions__element'));

  // Defensive: Only pair toggler with content if both exist and in order
  const rows = [];
  for (let i = 0; i < togglers.length && i < contents.length; i++) {
    // Use only the plain text for the title cell
    const titleText = togglers[i].textContent.trim();
    // For the content cell, use the entire accordion content block
    rows.push([titleText, contents[i]]);
  }

  // Build table cells array
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // If heading exists, insert it before the block
  if (heading) {
    element.parentNode.insertBefore(heading.cloneNode(true), element);
  }

  // Replace the original element with the block table
  element.replaceWith(block);
}
