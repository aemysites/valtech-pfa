/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards34) block: 2 columns, multiple rows, first row is block name
  const headerRow = ['Cards (cards34)'];
  const rows = [headerRow];

  // Find all card columns (each card is a col-xs-12 col-sm-1 with image, col-xs-12 col-sm-10 with text)
  const cardImages = element.querySelectorAll('.col-xs-12.col-sm-1 .teasers__teaser img');
  const cardTexts = element.querySelectorAll('.col-xs-12.col-sm-10 .teasers__teaser');

  // Defensive: only add row if both image and text exist
  for (let i = 0; i < Math.max(cardImages.length, cardTexts.length); i++) {
    const img = cardImages[i];
    const textContainer = cardTexts[i];
    if (!img || !textContainer) continue;

    // Collect all text content (including headings, paragraphs, spans, etc)
    const textCell = document.createElement('div');
    // Append all children (preserve structure)
    Array.from(textContainer.childNodes).forEach((node) => {
      // Only append if node contains text or is an element
      if ((node.nodeType === Node.ELEMENT_NODE && node.textContent.trim()) || (node.nodeType === Node.TEXT_NODE && node.textContent.trim())) {
        textCell.appendChild(node.cloneNode(true));
      }
    });

    rows.push([img, textCell]);
  }

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
