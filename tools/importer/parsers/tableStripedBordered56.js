/* global WebImporter */
export default function parse(element, { document }) {
  // Table Block Name Header
  const headerRow = ['Table (striped, bordered, tableStripedBordered56)'];

  // Extract form content (label, input placeholder, help text)
  const formGroup = element.querySelector('.years-to-pension__form-group');
  let labelText = '';
  let inputPlaceholder = '';
  if (formGroup) {
    const label = formGroup.querySelector('label');
    if (label) labelText = label.textContent.trim();
    const input = formGroup.querySelector('input');
    if (input && input.placeholder) inputPlaceholder = input.placeholder.trim();
  }
  const helpTextEl = element.querySelector('.years-to-pension__help-text');
  const helpText = helpTextEl ? helpTextEl.textContent.trim() : '';

  // Insert form content before the table, using semantic HTML
  const formFragment = document.createDocumentFragment();
  if (labelText) {
    const labelEl = document.createElement('label');
    labelEl.textContent = labelText;
    formFragment.appendChild(labelEl);
  }
  if (inputPlaceholder) {
    const inputEl = document.createElement('input');
    inputEl.type = 'number';
    inputEl.placeholder = inputPlaceholder;
    formFragment.appendChild(inputEl);
  }
  if (helpText) {
    const pEl = document.createElement('p');
    pEl.textContent = helpText;
    formFragment.appendChild(pEl);
  }

  // Find the main cal-table element
  const calTable = element.querySelector('.cal-table');

  // Extract the header columns (right side, header row)
  let tableHeaderRow = [];
  if (calTable) {
    const scrollableHeadRow = calTable.querySelector('.cal-table__scrollable .cal-table__thead .cal-table__row');
    if (scrollableHeadRow) {
      tableHeaderRow = Array.from(scrollableHeadRow.children).map(col => {
        const span = col.querySelector('span');
        return span ? span.textContent.trim() : col.textContent.trim();
      });
      // Prepend empty cell for the static column
      tableHeaderRow = ['', ...tableHeaderRow];
    }
  }

  // Extract the body row (right side, data row)
  let tableBodyRow = [];
  if (calTable) {
    // Static column (first cell)
    const staticRow = calTable.querySelector('.cal-table__static .cal-table__tbody .cal-table__row');
    let staticCell = '';
    if (staticRow) {
      const staticCol = staticRow.querySelector('.cal-table__column');
      if (staticCol) staticCell = staticCol.textContent.trim();
    }
    // Scrollable columns (second and third cell)
    const scrollableRow = calTable.querySelector('.cal-table__scrollable .cal-table__tbody .cal-table__row');
    let scrollableCells = [];
    if (scrollableRow) {
      scrollableCells = Array.from(scrollableRow.children).map(col => {
        const span = col.querySelector('span');
        return span ? span.textContent.trim() : col.textContent.trim();
      });
    }
    // Compose body row: [staticCell, ...scrollableCells]
    tableBodyRow = [staticCell, ...scrollableCells];
    while (tableBodyRow.length < 3) tableBodyRow.push('');
  }

  // Compose table rows
  const rows = [
    headerRow,
    tableHeaderRow,
    tableBodyRow,
  ];

  // Create the block table
  const blockTable = WebImporter.DOMUtils.createTable(rows, document);

  // Insert form content before the table
  element.parentNode.insertBefore(formFragment, element);

  // Replace original element with block table
  element.replaceWith(blockTable);
}
