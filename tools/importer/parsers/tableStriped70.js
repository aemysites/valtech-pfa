/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content column
  const mainDiv = element.querySelector(':scope > div');
  if (!mainDiv) return;
  const contentCol = mainDiv.querySelector(':scope > div');
  if (!contentCol) return;

  // Extract heading and paragraphs (including italic text)
  const heading = contentCol.querySelector('h5');
  const paragraphs = Array.from(contentCol.querySelectorAll('p'));

  // Compose intro content including italic text
  const introTexts = [];
  if (heading && heading.textContent.trim()) {
    introTexts.push(heading.textContent.trim());
  }
  paragraphs.forEach(p => {
    // If paragraph contains <em>, include its text as well
    const em = p.querySelector('em');
    if (em) {
      let beforeEm = '';
      for (const node of p.childNodes) {
        if (node === em) break;
        if (node.nodeType === Node.TEXT_NODE) beforeEm += node.textContent;
      }
      const emText = em.textContent.trim();
      const paraText = (beforeEm + emText).replace(/\s+/g, ' ').trim();
      if (paraText) introTexts.push(paraText);
    } else {
      const txt = p.textContent.replace(/\s+/g, ' ').trim();
      if (txt) introTexts.push(txt);
    }
  });

  // Find the table to extract (prefer the visible one)
  let table = contentCol.querySelector('table.hide-in-print');
  if (!table) {
    table = contentCol.querySelector('table.show-in-print');
  }
  if (!table) return;

  // Extract table headers and rows
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  if (!thead || !tbody) return;

  // Get header cells text (strip whitespace)
  const headerCells = Array.from(thead.querySelectorAll('th')).map(th => th.textContent.replace(/\s+/g, ' ').trim());

  // Get table body rows
  const bodyRows = Array.from(tbody.querySelectorAll('tr')).map(tr => {
    return Array.from(tr.children).map(td => {
      const link = td.querySelector('a');
      if (link) return link;
      const txt = td.textContent.replace(/\s+/g, ' ').trim();
      return txt;
    });
  });

  // Compose the block table
  const cells = [];
  // Block header row
  cells.push(['Table (striped, tableStriped70)']);
  // Add heading and paragraphs as a single cell row (all text content preserved)
  if (introTexts.length) cells.push([introTexts.join('\n')]);
  // Add each table row: first row is the column headers and data, merged
  if (headerCells.length && bodyRows.length) {
    // Merge column headers and first data row into one row
    const mergedRow = headerCells.map((header, idx) => {
      // If data exists for this column, append it after the header
      const data = bodyRows[0][idx];
      if (data && typeof data === 'string' && data !== '') {
        return header + '\n' + data;
      } else if (data) {
        // If data is an element (e.g., link), append after header
        return [header, data];
      } else {
        return header;
      }
    });
    cells.push(mergedRow);
    // If there are more data rows, add them as normal
    for (let i = 1; i < bodyRows.length; i++) {
      cells.push(bodyRows[i]);
    }
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(block);
}
