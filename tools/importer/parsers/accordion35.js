/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion (accordion35) block
  // Header row must be a single cell
  const headerRow = ['Accordion (accordion35)'];
  const rows = [headerRow];

  // Find all toggler elements (titles)
  const togglers = Array.from(element.querySelectorAll('.accordions__toggler'));
  // Find all corresponding content elements
  const contents = Array.from(element.querySelectorAll('.accordions__element'));

  // Defensive: Only process pairs where both title and content exist
  const count = Math.min(togglers.length, contents.length);
  for (let i = 0; i < count; i++) {
    // Title: Use only the textContent of the toggler
    const titleText = togglers[i].textContent.trim();
    // Content: Extract only the inner content, not the wrapper div
    const contentDiv = contents[i];
    // Collect all children of the contentDiv into a fragment
    const frag = document.createDocumentFragment();
    Array.from(contentDiv.childNodes).forEach((node) => {
      frag.appendChild(node.cloneNode(true));
    });
    rows.push([
      titleText,
      frag
    ]);
  }

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the new block table
  element.replaceWith(table);
}
