/* global WebImporter */
export default function parse(element, { document }) {
  // Extract heading and intro paragraph (if present)
  const heading = element.querySelector('h2, h1');
  const introPara = heading ? heading.nextElementSibling : null;
  const fragment = document.createDocumentFragment();
  if (heading) fragment.appendChild(heading.cloneNode(true));
  if (introPara && introPara.tagName === 'P') fragment.appendChild(introPara.cloneNode(true));

  // Accordion block header row
  const headerRow = ['Accordion (accordion28)'];
  const rows = [headerRow];

  // Find all accordion toggler elements
  const togglers = Array.from(element.querySelectorAll('.accordions__toggler'));
  togglers.forEach((toggler) => {
    // Find the corresponding content wrapper for this toggler
    let contentWrapper = toggler.nextElementSibling;
    while (contentWrapper && !contentWrapper.classList.contains('accordions__element') && !contentWrapper.classList.contains('accordion__element')) {
      contentWrapper = contentWrapper.nextElementSibling;
    }
    // Defensive: If content is found, use it; otherwise, leave cell empty
    const titleCell = toggler;
    const contentCell = contentWrapper ? contentWrapper : document.createElement('div');
    rows.push([titleCell, contentCell]);
  });

  // Create the accordion block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element with heading/intro + accordion block
  if (fragment.childNodes.length) {
    element.replaceWith(fragment, block);
  } else {
    element.replaceWith(block);
  }
}
