/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion20)'];
  const rows = [headerRow];

  // Find all toggler elements (accordion headers)
  const togglers = element.querySelectorAll('.accordions__toggler');

  togglers.forEach((toggler) => {
    // The content element is the next sibling with class 'accordions__element'
    let content = toggler.nextElementSibling;
    if (!content || !content.classList.contains('accordions__element')) {
      // Defensive: skip if structure is broken
      return;
    }
    rows.push([toggler, content]);
  });

  // Find the informational paragraph and link at the end of the block
  const infoPara = Array.from(element.querySelectorAll('p')).find(p => {
    return !p.classList.contains('accordions__toggler') && !p.closest('.accordions__element');
  });
  const infoLink = Array.from(element.querySelectorAll('a[href="#fund"]')).find(a => {
    return !a.closest('.accordions__element');
  });
  if (infoPara || infoLink) {
    const contentCell = document.createElement('div');
    if (infoPara) contentCell.appendChild(infoPara.cloneNode(true));
    if (infoLink) contentCell.appendChild(infoLink.cloneNode(true));
    // Use empty string for title cell (not clickable)
    rows.push(['', contentCell]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
