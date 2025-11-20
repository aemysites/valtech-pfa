/* global WebImporter */
export default function parse(element, { document }) {
  // Extract accordion items
  const togglers = Array.from(element.querySelectorAll('.accordions__toggler'));
  const contents = Array.from(element.querySelectorAll('.accordions__element'));
  const numItems = Math.min(togglers.length, contents.length);

  // Build accordion rows
  const rows = [];
  rows.push(['Accordion (accordion138)']);
  for (let i = 0; i < numItems; i++) {
    // Use only the text content for the title cell
    rows.push([togglers[i].textContent.trim(), contents[i]]);
  }
  const accordionBlock = WebImporter.DOMUtils.createTable(rows, document);

  // --- Collect all remaining non-accordion content ---
  // Heading
  const heading = element.querySelector('h2');

  // Find all non-accordion content after the last accordion
  let afterAccordionContent = [];
  let lastAccordion = contents.length ? contents[contents.length - 1] : null;
  if (lastAccordion) {
    let node = lastAccordion.nextElementSibling;
    while (node) {
      // Accept all non-empty elements (paragraphs, headings, lists)
      if (
        node.matches('p, h5, ul') &&
        node.textContent.trim() &&
        !node.classList.contains('accordions__toggler') &&
        !node.classList.contains('accordion__element')
      ) {
        afterAccordionContent.push(node.cloneNode(true));
      }
      node = node.nextElementSibling;
    }
  }

  // Also include .panel__links as a <ul> (for the red link)
  const panelLinks = element.querySelector('.panel__links');
  if (panelLinks) {
    afterAccordionContent.push(panelLinks.cloneNode(true));
  }

  // Also include any <h5> and <p> after .panel__links
  if (panelLinks) {
    let node = panelLinks.nextElementSibling;
    while (node) {
      if (node.matches('h5, p') && node.textContent.trim()) {
        afterAccordionContent.push(node.cloneNode(true));
      }
      node = node.nextElementSibling;
    }
  }

  // Compose all content into a fragment
  const fragment = document.createDocumentFragment();
  if (heading) fragment.appendChild(heading.cloneNode(true));
  fragment.appendChild(accordionBlock);
  afterAccordionContent.forEach((el) => fragment.appendChild(el));

  // Replace the original element
  element.replaceWith(fragment);
}
