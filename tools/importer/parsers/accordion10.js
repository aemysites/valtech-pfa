/* global WebImporter */
export default function parse(element, { document }) {
  // Find heading and intro paragraph (assume first h2 and first p before accordions)
  const heading = element.querySelector('h2');
  const intro = Array.from(element.querySelectorAll('p')).find(p => !p.classList.contains('accordions__toggler') && !p.closest('.accordions__element'));

  // Accordion block: extract all toggler/content pairs
  const togglerSelector = '.accordions__toggler';
  const contentSelector = '.accordions__element';
  const togglers = Array.from(element.querySelectorAll(togglerSelector));
  const contents = Array.from(element.querySelectorAll(contentSelector));
  const numItems = Math.min(togglers.length, contents.length);

  // Table header row (must match block name exactly)
  const headerRow = ['Accordion (accordion10)'];
  const rows = [headerRow];

  // --- FIX: Place heading and intro paragraph together in the first cell of the first accordion item ---
  // If both heading and intro exist, prepend them to the first accordion content
  for (let i = 0; i < numItems; i++) {
    const titleEl = togglers[i];
    let contentEl = contents[i];
    if (i === 0 && (heading || intro)) {
      // Create a wrapper div to hold both heading, intro, and the original content
      const wrapper = document.createElement('div');
      if (heading) wrapper.appendChild(heading.cloneNode(true));
      if (intro) wrapper.appendChild(intro.cloneNode(true));
      // Append the original content
      Array.from(contentEl.childNodes).forEach(node => wrapper.appendChild(node.cloneNode(true)));
      contentEl = wrapper;
    }
    rows.push([titleEl, contentEl]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
