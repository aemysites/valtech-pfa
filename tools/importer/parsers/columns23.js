/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns23)'];

  // Defensive: Get all immediate child columns
  const columns = Array.from(element.querySelectorAll(':scope > .col, :scope > div.col'));

  // For each column, collect its heading and its three content rows as a single column cell
  const columnCells = columns.map((col) => {
    // Get heading (h4)
    const heading = col.querySelector('h4');
    // Get all content rows (each .row inside the column)
    const contentRows = Array.from(col.querySelectorAll(':scope > .row'));
    // For each content row, extract the icon and text
    const items = contentRows.map((row) => {
      // Defensive: Find image and text
      const img = row.querySelector('img');
      // The text is in the col-xs-10 div, which contains a <p>
      const textCol = row.querySelector('.col-xs-10');
      // Defensive: If textCol exists, use its children; else, fallback to row text
      let textContent;
      if (textCol) {
        // Use all children (could be <p>, <strong>, <br>, etc.)
        textContent = Array.from(textCol.childNodes);
      } else {
        textContent = [row.textContent];
      }
      // Compose: icon + text
      const itemDiv = document.createElement('div');
      itemDiv.style.display = 'flex';
      itemDiv.style.alignItems = 'flex-start';
      if (img) {
        itemDiv.appendChild(img);
      }
      // Wrap text in a div for spacing
      const textDiv = document.createElement('div');
      textContent.forEach((node) => {
        textDiv.append(node);
      });
      itemDiv.appendChild(textDiv);
      return itemDiv;
    });
    // Compose column: heading + items
    const colDiv = document.createElement('div');
    if (heading) {
      colDiv.appendChild(heading);
    }
    items.forEach((item) => {
      colDiv.appendChild(item);
    });
    return colDiv;
  });

  // Table: header row, then one row with two columns
  const tableCells = [
    headerRow,
    columnCells
  ];

  const block = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(block);
}
