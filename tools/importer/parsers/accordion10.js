/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract all accordion items (title/content pairs) from a teaser
  function extractAccordionItems(teaser) {
    const items = [];
    // Find all toggler/content pairs inside this teaser
    const togglers = teaser.querySelectorAll(':scope > .accordions__toggler');
    let current = teaser.firstElementChild;
    while (current) {
      if (current.classList.contains('accordions__toggler')) {
        const titleElem = current;
        let contentElem = current.nextElementSibling;
        // Only accept if the next sibling is an accordions__element
        if (contentElem && contentElem.classList.contains('accordions__element')) {
          // Check if content is empty (e.g., <p></p>), skip if so
          const hasContent = contentElem.textContent.trim().length > 0 || contentElem.querySelector('a, strong, em, br');
          if (hasContent) {
            items.push([titleElem.cloneNode(true), contentElem.cloneNode(true)]);
          }
        }
      }
      current = current.nextElementSibling;
    }
    return items;
  }

  // Find all teasers in all columns
  const teasers = element.querySelectorAll('.teasers__teaser');
  const rows = [];
  // Header row
  rows.push(['Accordion (accordion10)']);
  // For each teaser, extract its accordion items
  teasers.forEach(teaser => {
    const items = extractAccordionItems(teaser);
    items.forEach(([titleElem, contentElem]) => {
      rows.push([titleElem, contentElem]);
    });
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
