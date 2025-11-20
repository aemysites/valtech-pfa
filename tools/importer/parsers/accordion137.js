/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion137)'];
  const rows = [headerRow];

  // Find all toggler elements (accordion titles)
  const togglers = Array.from(element.querySelectorAll('p.accordions__toggler'));
  // Find all content elements (accordion bodies)
  const contents = Array.from(element.querySelectorAll('div.accordions__element'));

  // Defensive: Only process pairs (title/content)
  const numItems = Math.min(togglers.length, contents.length);
  for (let i = 0; i < numItems; i++) {
    const title = togglers[i];
    const content = contents[i].cloneNode(true);
    // Replace iframes in content with links
    Array.from(content.querySelectorAll('iframe[src]')).forEach((iframe) => {
      const link = document.createElement('a');
      link.href = iframe.src;
      link.textContent = iframe.src;
      iframe.replaceWith(link);
    });
    rows.push([title, content]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the block table
  element.replaceWith(table);
}
