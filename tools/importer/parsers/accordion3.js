/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion3)'];

  // Get heading and all following paragraphs up to the toggler
  const heading = element.querySelector('h2');
  const descParas = [];
  let node = heading && heading.nextElementSibling;
  while (node && !node.classList.contains('accordions__toggler')) {
    if (node.tagName === 'P' && node.textContent.trim()) {
      descParas.push(node.cloneNode(true));
    }
    node = node.nextElementSibling;
  }

  // Compose intro fragment (heading + all description paragraphs)
  const introFragment = document.createDocumentFragment();
  if (heading) introFragment.appendChild(heading.cloneNode(true));
  descParas.forEach(p => introFragment.appendChild(p));

  // Find the toggler (accordion title)
  const toggler = element.querySelector('.accordions__toggler');
  if (!toggler) return;

  // Find the accordion content (the expandable details)
  const accordionContent = element.querySelector('.accordions__element');
  let contentCell = '';
  if (accordionContent) {
    // Only keep one inner table (prefer .show-in-print)
    const mainTable = accordionContent.querySelector('.show-in-print') || accordionContent.querySelector('table');
    // Remove all .hide-in-print tables
    accordionContent.querySelectorAll('.hide-in-print').forEach(t => t.remove());
    // Remove empty paragraphs/spans
    accordionContent.querySelectorAll('p, span').forEach(node => {
      if (!node.textContent.trim()) node.remove();
    });
    // Compose a fragment with the main table and any remaining content (no duplicates)
    const contentFragment = document.createDocumentFragment();
    if (mainTable) contentFragment.appendChild(mainTable.cloneNode(true));
    // Add any remaining paragraphs/spans that are not inside the table
    accordionContent.childNodes.forEach(child => {
      if ((child.tagName === 'P' || child.tagName === 'SPAN') && child.textContent.trim()) {
        contentFragment.appendChild(child.cloneNode(true));
      }
    });
    contentCell = contentFragment;
  }

  // Compose rows: header + intro row + accordion item row
  const rows = [
    headerRow,
    [introFragment, ''],
    [toggler.cloneNode(true), contentCell]
  ];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
