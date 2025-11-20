/* global WebImporter */
export default function parse(element, { document }) {
  // Extract hero section: heading, description, illustration
  let heading = element.querySelector('h2');
  let description;
  let illustration;
  // Find all centered paragraphs (description and possibly illustration)
  const centeredPs = Array.from(element.querySelectorAll('p')).filter(p => p.style.textAlign === 'center');
  if (centeredPs.length > 0) {
    description = centeredPs[0];
    // Look for an img inside a centered paragraph (illustration)
    for (const p of centeredPs) {
      const img = p.querySelector('img');
      if (img) {
        illustration = img;
        break;
      }
    }
  }

  // Compose hero section as a fragment
  const heroFragment = document.createDocumentFragment();
  if (heading) heroFragment.appendChild(heading.cloneNode(true));
  if (description) heroFragment.appendChild(description.cloneNode(true));
  if (illustration) heroFragment.appendChild(illustration.cloneNode(true));

  // Accordion items: toggler paragraphs and their content blocks
  const togglerPs = Array.from(element.querySelectorAll('p.accordions__toggler'));
  const accordionElements = Array.from(element.querySelectorAll('div.accordions__element'));
  const rows = [];
  for (let i = 0; i < togglerPs.length && i < accordionElements.length; i++) {
    // Use plain text for title cell, per markdown example
    const titleText = togglerPs[i].textContent.trim();
    // Use the full content block for content cell
    rows.push([titleText, accordionElements[i]]);
  }

  // Table header (block name)
  const headerRow = ['Accordion (accordion83)'];
  const cells = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Insert hero section above the block table
  element.parentNode.insertBefore(heroFragment, element);
  // Replace the original element with the block table
  element.replaceWith(block);
}
