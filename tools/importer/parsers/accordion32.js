/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row (single cell)
  const headerRow = ['Accordion (accordion32)'];

  // Extract the accordion toggler title
  const toggler = element.querySelector('.accordions__toggler');
  const titleText = toggler ? toggler.textContent.trim() : '';

  // Extract all content for the accordion body
  const content = element.querySelector('.accordions__element, .accordion__element');
  let contentCell = '';
  if (content) {
    // Collect all child nodes (including text and elements)
    const frag = document.createDocumentFragment();
    Array.from(content.childNodes).forEach((node) => {
      frag.appendChild(node.cloneNode(true));
    });
    contentCell = frag;
  }

  // Build the table rows: header row (single cell), then each accordion item as [title, content]
  const rows = [
    headerRow,
    [titleText, contentCell]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
