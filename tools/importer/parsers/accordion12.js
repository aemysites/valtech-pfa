/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main heading (if present)
  const heading = element.querySelector('h5');

  // Accordion block header row
  const headerRow = ['Accordion (accordion12)'];
  const rows = [headerRow];

  // Find all toggler elements (accordion headers)
  const togglers = Array.from(element.querySelectorAll('.accordions__toggler'));
  // Find all accordion content elements
  const contents = Array.from(element.querySelectorAll('.accordions__element'));

  // Defensive: Only pair togglers and contents by order
  for (let i = 0; i < togglers.length && i < contents.length; i++) {
    const titleText = togglers[i].textContent.trim();
    const contentCell = contents[i]; // Use the content element directly
    rows.push([titleText, contentCell]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // If heading is present, insert it before the block
  if (heading) {
    element.parentNode.insertBefore(heading.cloneNode(true), element);
  }

  // Replace the original element
  element.replaceWith(block);
}
