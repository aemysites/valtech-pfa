/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion31)'];
  const rows = [headerRow];

  // Find all accordion toggler elements (titles)
  // They are <p class="accordions__toggler"> inside the main block
  const togglers = Array.from(element.querySelectorAll('p.accordions__toggler'));

  // Defensive: If no togglers, do nothing
  if (!togglers.length) return;

  togglers.forEach((toggler) => {
    // The content for each accordion item is the next sibling .accordions__element
    let content = toggler.nextElementSibling;
    // Defensive: Only proceed if content exists and has the right class
    if (!content || !content.classList.contains('accordions__element')) return;

    // Title cell: use the toggler element itself
    // Content cell: use the entire .accordions__element block
    rows.push([
      toggler,
      content
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the block
  element.replaceWith(block);
}
