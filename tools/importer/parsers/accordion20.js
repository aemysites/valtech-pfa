/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block: extract toggler titles and their corresponding content
  const headerRow = ['Accordion (accordion20)'];
  const rows = [headerRow];

  // Find all toggler elements (accordion titles)
  const togglers = Array.from(element.querySelectorAll('p.accordions__toggler'));
  togglers.forEach((toggler) => {
    // The content is the next sibling with class 'accordions__element'
    let content = toggler.nextElementSibling;
    if (!content || !content.classList.contains('accordions__element')) return;
    if (!content.textContent.trim()) return;
    rows.push([toggler, content]);
  });

  // Find the informational paragraph and the link at the bottom of the block
  // These are outside the accordion structure, after the last toggler/element
  // We'll add them as an extra accordion row with a generic title
  // Only include the summary and link that appear after all accordions
  let lastAccordion = null;
  if (togglers.length) {
    lastAccordion = togglers[togglers.length - 1].nextElementSibling;
    if (lastAccordion && lastAccordion.classList.contains('accordions__element')) {
      lastAccordion = lastAccordion;
    }
  }
  // Collect all <p> and <a> elements after the last accordion element
  let infoNodes = [];
  if (lastAccordion) {
    let node = lastAccordion.nextSibling;
    while (node) {
      if (node.nodeType === 1 && (node.tagName === 'P' || node.tagName === 'A')) {
        // Only include non-empty paragraphs and the correct link
        if (node.tagName === 'P' && node.textContent.trim()) {
          infoNodes.push(node);
        }
        if (node.tagName === 'A' && node.getAttribute('href') === '#fund') {
          infoNodes.push(node);
        }
      }
      node = node.nextSibling;
    }
  }
  if (infoNodes.length) {
    const contentDiv = document.createElement('div');
    infoNodes.forEach(n => contentDiv.appendChild(n.cloneNode(true)));
    // Use a generic summary title for the summary row
    rows.push(['Overblik', contentDiv]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
