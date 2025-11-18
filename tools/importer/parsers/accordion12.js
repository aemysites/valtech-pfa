/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main heading (first h5)
  const heading = element.querySelector('h5');

  // Find all toggler titles and their corresponding content blocks
  const togglers = Array.from(element.querySelectorAll('.accordions__toggler'));
  const items = [];

  togglers.forEach((toggler) => {
    // The content block is the next sibling with class 'accordions__element'
    let content = toggler.nextElementSibling;
    if (!content || !content.classList.contains('accordions__element')) {
      // Defensive: fallback to searching siblings
      content = Array.from(element.querySelectorAll('.accordions__element')).find(
        el => el.previousElementSibling === toggler
      );
    }
    if (content) {
      // Use only the text content for the title cell
      items.push([toggler.textContent.trim(), content]);
    }
  });

  // Build the table rows
  const headerRow = ['Accordion (accordion12)'];
  const rows = [headerRow];

  // Add the main heading as a row above the accordion items
  if (heading) {
    rows.push([heading.textContent.trim(), '']);
  }

  items.forEach(([title, contentEl]) => {
    rows.push([
      title,
      contentEl
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
