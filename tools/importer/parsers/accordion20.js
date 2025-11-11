/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all top-level accordion items
  function getAccordionItems(root) {
    // Find all toggler elements (accordion headers)
    const togglers = Array.from(root.querySelectorAll('.accordions__toggler'));
    const items = [];
    togglers.forEach((toggler) => {
      // The next sibling with class 'accordions__element' is the content
      let content = toggler.nextElementSibling;
      if (content && content.classList.contains('accordions__element')) {
        items.push({ title: toggler, content });
      }
    });
    return items;
  }

  // Build table rows for each accordion item
  const rows = [];
  const headerRow = ['Accordion (accordion20)'];
  rows.push(headerRow);

  // Get all accordion items
  const accordionItems = getAccordionItems(element);
  accordionItems.forEach(({ title, content }) => {
    rows.push([title, content]);
  });

  // Find informational paragraph and link NOT inside accordion toggler/element
  const infoParagraphs = Array.from(element.querySelectorAll('p'))
    .filter(p => !p.classList.contains('accordions__toggler') && !p.closest('.accordions__element'));
  const infoLinks = Array.from(element.querySelectorAll('a'))
    .filter(a => a.textContent.trim().length > 0 && !a.closest('.accordions__element'));

  // If there is informational content, add it as a separate row with both cells populated
  if (infoParagraphs.length || infoLinks.length) {
    const infoCell = document.createElement('div');
    infoParagraphs.forEach(p => infoCell.appendChild(p.cloneNode(true)));
    infoLinks.forEach(a => infoCell.appendChild(a.cloneNode(true)));
    rows.push([infoCell, infoCell.cloneNode(true)]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new block table
  element.replaceWith(block);
}
