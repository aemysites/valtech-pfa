/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards11) block: 2 columns, multiple rows, first row is block name
  const headerRow = ['Cards (cards11)'];
  const rows = [headerRow];

  // Find all card columns (each card is a .col-xs-12.col-sm-4)
  const cardElements = Array.from(element.querySelectorAll('.col-xs-12.col-sm-4'));

  cardElements.forEach((card) => {
    // Image: first child div > img
    const imgContainer = card.children[0];
    const img = imgContainer && imgContainer.querySelector('img');

    // Text: second child div, contains h4
    const textContainer = card.children[1];
    let title = '';
    if (textContainer) {
      const h4 = textContainer.querySelector('h4');
      if (h4) {
        title = h4.textContent.trim();
      }
    }
    // Compose the text cell: preserve heading as <h4>
    const cell = document.createElement('div');
    if (title) {
      const heading = document.createElement('h4');
      heading.textContent = title;
      cell.appendChild(heading);
    }
    rows.push([
      img || document.createTextNode(''),
      cell
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
