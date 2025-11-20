/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion54)'];

  // Find heading and intro paragraph (they appear before the accordion toggler)
  const heading = element.querySelector('h3');
  const intro = element.querySelector('h3 ~ p');

  // Find all toggler/title elements
  const togglers = Array.from(element.querySelectorAll('.accordions__toggler'));
  if (!togglers.length) return;

  // Build rows for each accordion item
  const rows = togglers.map((toggler) => {
    // Title cell: use the toggler element itself
    // Content cell: the next sibling with class 'accordions__element'
    let contentCell = null;
    let sibling = toggler.nextElementSibling;
    while (sibling) {
      if (sibling.classList.contains('accordions__element')) {
        contentCell = sibling;
        break;
      }
      sibling = sibling.nextElementSibling;
    }
    // Defensive: if no content, use empty div
    // Prepend heading and intro to content cell
    const contentWrapper = document.createElement('div');
    if (heading) contentWrapper.appendChild(heading.cloneNode(true));
    if (intro) contentWrapper.appendChild(intro.cloneNode(true));
    if (contentCell) contentWrapper.appendChild(contentCell.cloneNode(true));
    return [toggler.cloneNode(true), contentWrapper];
  });

  // Compose the table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
