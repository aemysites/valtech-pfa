/* global WebImporter */
export default function parse(element, { document }) {
  // Get the three columns
  const columns = Array.from(element.querySelectorAll('.row > .col-xs-12.col-sm-4'));
  if (columns.length !== 3) return;

  // --- COLUMN 1 ---
  const col1 = columns[0];
  const col1Content = [];
  Array.from(col1.children).forEach((child) => {
    if (child.classList.contains('teasers__teaser') && child.innerHTML.trim() === '') return;
    col1Content.push(child);
  });

  // --- COLUMN 2 ---
  const col2 = columns[1];
  const col2Content = [];
  Array.from(col2.childNodes).forEach((node) => {
    if (node.nodeType === 1 && node.classList && node.classList.contains('teasers__teaser') && node.innerHTML.trim() === '') return;
    if (node.nodeType === 1 && node.tagName === 'P' && node.innerHTML.trim() === '&nbsp;') return;
    if (node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim() !== '')) {
      col2Content.push(node);
    }
  });

  // --- COLUMN 3 ---
  const col3 = columns[2];
  const col3Content = [];
  // Only one image
  const img = col3.querySelector('img');
  if (img) col3Content.push(img);
  // Find the photo credit text (em element containing the credit)
  // Must be included as an <em> element below the image
  const creditEm = col3.querySelector('.teasers__teaser em');
  if (creditEm && creditEm.textContent.trim()) {
    col3Content.push(creditEm);
  }

  // --- Table Assembly ---
  const headerRow = ['Columns (columns48)'];
  const contentRow = [col1Content, col2Content, col3Content];
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
