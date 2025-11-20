/* global WebImporter */
export default function parse(element, { document }) {
  // Find the heading at the top (if present)
  const heading = element.querySelector('h5');

  // Find all toggler and content pairs for the accordion
  const togglers = Array.from(element.querySelectorAll('.accordions__toggler'));
  const contents = Array.from(element.querySelectorAll('.accordions__element'));

  // Defensive: Only proceed if we have at least one pair
  if (!togglers.length || !contents.length) return;

  // Always use the required header row
  const headerRow = ['Accordion (accordion55)'];

  // Compose rows: Each accordion item is a pair of toggler (title) and content
  const rows = [];
  for (let i = 0; i < Math.min(togglers.length, contents.length); i++) {
    // Use only the text for the title cell, not the full element
    let titleText = togglers[i].textContent.trim();
    // If heading exists and this is the first row, prepend heading to content cell
    let contentCell = contents[i];
    if (i === 0 && heading) {
      // Create a wrapper div for heading and content
      const wrapper = document.createElement('div');
      const headingClone = heading.cloneNode(true);
      wrapper.appendChild(headingClone);
      // Move all children from contentCell into wrapper
      while (contentCell.firstChild) {
        wrapper.appendChild(contentCell.firstChild);
      }
      contentCell = wrapper;
    }
    rows.push([titleText, contentCell]);
  }

  // Create the table using the WebImporter utility
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the original element with the table
  element.replaceWith(table);
}
