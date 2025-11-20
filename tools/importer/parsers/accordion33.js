/* global WebImporter */
export default function parse(element, { document }) {
  // Collect heading and intro paragraphs (to be included as the first row in the accordion table)
  const heading = element.querySelector('h2:not([style*="display:none"])');
  let introParas = [];
  for (const p of element.querySelectorAll('p')) {
    if (p.classList.contains('accordions__toggler')) break;
    introParas.push(p);
  }

  // Helper: Get all toggler and element pairs
  function getAccordionItems(root) {
    const togglers = Array.from(root.querySelectorAll('.accordions__toggler'));
    const elements = Array.from(root.querySelectorAll('.accordions__element'));
    const items = [];
    for (let i = 0; i < Math.min(togglers.length, elements.length); i++) {
      // Only use textContent for title cell
      const titleText = togglers[i].textContent.trim();
      items.push([
        titleText,
        elements[i]
      ]);
    }
    return items;
  }

  // Build table rows
  const headerRow = ['Accordion (accordion33)'];
  const rows = [headerRow];

  // Add heading and intro as first row in the accordion table
  if (heading || introParas.length) {
    const introFragment = document.createElement('div');
    if (heading) introFragment.appendChild(heading.cloneNode(true));
    introParas.forEach(p => introFragment.appendChild(p.cloneNode(true)));
    rows.push(['', introFragment]);
  }

  // Get accordion items
  const accordionItems = getAccordionItems(element);
  rows.push(...accordionItems);

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
