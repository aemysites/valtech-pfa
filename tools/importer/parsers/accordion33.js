/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as required
  const headerRow = ['Accordion (accordion33)'];
  const rows = [headerRow];

  // Extract all intro nodes before the first accordion toggler
  const firstToggler = element.querySelector('.accordions__toggler');
  const introNodes = [];
  let node = element.firstElementChild;
  while (node && node !== firstToggler) {
    introNodes.push(node.cloneNode(true));
    node = node.nextElementSibling;
  }
  // Combine intro nodes into a single cell and add as the first accordion item
  if (introNodes.length) {
    const introCell = document.createElement('div');
    introNodes.forEach(n => introCell.appendChild(n));
    rows.push(['', introCell]);
  }

  // Find all toggler and element pairs
  const togglers = Array.from(element.querySelectorAll('.accordions__toggler'));
  const elements = Array.from(element.querySelectorAll('.accordions__element'));
  const itemCount = Math.min(togglers.length, elements.length);

  for (let i = 0; i < itemCount; i++) {
    // Use only the textContent for the title cell
    const titleText = togglers[i].textContent.trim();
    // For content, clone the element so formatting is preserved
    const contentCell = elements[i].cloneNode(true);
    rows.push([titleText, contentCell]);
  }

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
