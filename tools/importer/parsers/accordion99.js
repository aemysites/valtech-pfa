/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block: extract all toggler/content pairs
  const headerRow = ['Accordion (accordion99)'];
  const rows = [headerRow];

  // Accordion items: toggler/content pairs
  // Toggler: <p class="accordions__toggler">
  // Content: next sibling <div class="accordions__element">
  const togglers = Array.from(element.querySelectorAll('p.accordions__toggler'));
  togglers.forEach(toggler => {
    // Defensive: find the next sibling that is a content element
    let content = toggler.nextElementSibling;
    while (content && !content.classList.contains('accordions__element')) {
      content = content.nextElementSibling;
    }
    if (content) {
      // Only push the textContent and innerHTML, not the original elements
      // Title: get full textContent (preserving links)
      // Content: get innerHTML (preserving formatting and links)
      // We'll use a temporary div to extract rich content for the answer
      // For the title, preserve links if present
      let titleCell;
      if (toggler.querySelector('a')) {
        // If there are links, clone and use innerHTML
        const clone = toggler.cloneNode(true);
        titleCell = clone.innerHTML;
      } else {
        titleCell = toggler.textContent.trim();
      }
      // For the content, preserve rich HTML
      const contentCell = content.innerHTML.trim();
      rows.push([titleCell, contentCell]);
    }
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
