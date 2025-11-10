/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion19)'];

  // Find the visible heading (should be included above the table)
  const h2s = Array.from(element.querySelectorAll('h2'));
  const visibleHeading = h2s.find(h => h.offsetParent !== null);
  if (visibleHeading && visibleHeading.textContent.trim()) {
    element.parentNode.insertBefore(visibleHeading.cloneNode(true), element);
  }

  // Find the accordion toggler (title)
  const toggler = element.querySelector('.accordions__toggler');
  // Find the accordion content
  const accordionContent = element.querySelector('.accordions__element, .accordion__element');

  // Compose the accordion item row
  let accordionTitle = toggler;
  let accordionBody = accordionContent;

  // Defensive: if no toggler, fallback to heading text
  if (!accordionTitle) {
    accordionTitle = document.createElement('div');
    accordionTitle.textContent = visibleHeading ? visibleHeading.textContent : 'Accordion';
  }

  // Defensive: if no body, fallback to empty
  if (!accordionBody) {
    accordionBody = document.createElement('div');
  }

  // Build rows: header, accordion item
  const rows = [headerRow];
  rows.push([accordionTitle, accordionBody]);

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Find CTA button (Log på Mit PFA)
  const cta = element.querySelector('.cta-btn, .col-xs-12.text-center a');
  if (cta) {
    element.parentNode.insertBefore(cta.cloneNode(true), element.nextSibling);
  }

  // Replace original element
  element.replaceWith(block);
}
