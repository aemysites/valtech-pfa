/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion10)'];
  const rows = [headerRow];

  // Find all toggler and content pairs
  const togglers = Array.from(element.querySelectorAll('p.accordions__toggler'));
  togglers.forEach((toggler) => {
    let content = toggler.nextElementSibling;
    if (!content || !content.classList.contains('accordions__element')) {
      content = Array.from(element.querySelectorAll('.accordions__element')).find(
        el => el.previousElementSibling === toggler
      );
    }
    if (!content) return;
    rows.push([toggler, content]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Add heading and intro paragraph above the table if present
  const heading = element.querySelector('h2');
  const intro = element.querySelector('p:not(.accordions__toggler)');
  if (heading || intro) {
    const wrapper = document.createElement('div');
    if (heading) wrapper.appendChild(heading.cloneNode(true));
    if (intro) wrapper.appendChild(intro.cloneNode(true));
    element.replaceWith(wrapper);
    wrapper.appendChild(table);
  } else {
    element.replaceWith(table);
  }
}
