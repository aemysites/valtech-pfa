/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content container
  const container = element.querySelector('.container-fluid') || element;

  // Find heading (visible h2)
  const heading = container.querySelector('h2:not([style*="display:none"])');

  // Collect intro paragraphs before accordions
  const introParas = [];
  for (const child of container.children) {
    if (child.classList.contains('accordions__toggler')) break;
    if (child.tagName === 'P' && child.textContent.trim()) {
      introParas.push(child);
    }
  }

  // Find all accordion toggler elements and their corresponding content blocks
  const togglers = Array.from(container.querySelectorAll('.accordions__toggler'));
  const elements = Array.from(container.querySelectorAll('.accordions__element'));

  // Defensive: Only pair togglers and elements if counts match
  const accordionRows = [];
  for (let i = 0; i < Math.min(togglers.length, elements.length); i++) {
    const title = togglers[i];
    const content = elements[i];
    accordionRows.push([title, content]);
  }

  // Build table rows
  const rows = [];
  // Header row: Must match block name exactly
  rows.push(['Accordion (accordion46)']);

  // Add a row for the heading and intro paragraphs (all in first cell, second cell contains all intro paragraphs)
  if (heading || introParas.length) {
    const introCell = document.createElement('div');
    if (heading) introCell.appendChild(heading.cloneNode(true));
    introParas.forEach(p => introCell.appendChild(p.cloneNode(true)));
    // Place all intro content in the second cell, first cell empty
    rows.push(['', introCell]);
  }

  // Add each accordion item as a row (title, content)
  accordionRows.forEach(([title, content]) => {
    rows.push([title, content]);
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
