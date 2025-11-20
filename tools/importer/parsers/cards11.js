/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards11) block: 2 columns, multiple rows, first row is header
  const headerRow = ['Cards (cards11)'];
  const rows = [headerRow];

  // Find all card columns (each card is a .col-xs-12.col-sm-4)
  const cardEls = Array.from(element.querySelectorAll('.col-xs-12.col-sm-4'));

  cardEls.forEach((cardEl) => {
    // Image: first img in card
    const img = cardEl.querySelector('img');

    // Find all text content below the image
    // This source HTML uses a <div> with <h4> inside for the title
    // We'll grab the <h4> and any text nodes inside the div
    const textDiv = cardEl.querySelectorAll('div')[1];
    let textContent = [];
    if (textDiv) {
      // Grab all child nodes except empty text
      Array.from(textDiv.childNodes).forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          textContent.push(node);
        } else if (node.nodeType === Node.TEXT_NODE) {
          const txt = node.textContent.replace(/\u00a0/g, ' ').trim();
          if (txt) textContent.push(txt);
        }
      });
    }
    // If textContent is empty, fallback to cardEl.textContent
    if (textContent.length === 0) {
      const txt = cardEl.textContent.replace(/\u00a0/g, ' ').trim();
      if (txt) textContent.push(txt);
    }

    rows.push([
      img,
      textContent
    ]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
