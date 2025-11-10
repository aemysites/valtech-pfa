/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion31)'];

  // Find the main heading at the top (visible in screenshot)
  const headingEl = element.querySelector('h5');

  // Find all toggler titles (accordion headers)
  const togglerEls = Array.from(element.querySelectorAll('.accordions__toggler'));
  // Find all corresponding content blocks (accordion bodies)
  const contentEls = Array.from(element.querySelectorAll('.accordions__element'));

  // Defensive: Only pair up as many content blocks as there are togglers
  const numItems = Math.min(togglerEls.length, contentEls.length);
  const rows = [headerRow];

  for (let i = 0; i < numItems; i++) {
    // Title cell: Use only the text content of the toggler (not the element itself)
    const titleText = togglerEls[i]?.textContent?.trim() || '';
    const contentEl = contentEls[i].cloneNode(true);
    // If this is the first accordion item and heading is present, prepend heading to content
    if (i === 0 && headingEl) {
      // Create a container div for heading + content
      const container = document.createElement('div');
      container.appendChild(headingEl.cloneNode(true));
      Array.from(contentEl.childNodes).forEach(node => container.appendChild(node));
      rows.push([
        titleText,
        container
      ]);
    } else {
      rows.push([
        titleText,
        contentEl
      ]);
    }
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the block
  element.replaceWith(block);
}
