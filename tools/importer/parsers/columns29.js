/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate child divs
  function getImmediateDivs(el) {
    return Array.from(el.children).filter(child => child.tagName === 'DIV');
  }

  // Find the main row containing the columns
  let row;
  // Defensive: find the first child with class 'row' that contains columns
  const allRows = element.querySelectorAll('.row');
  for (const r of allRows) {
    // Look for a row with at least two column children
    const colCount = Array.from(r.children).filter(
      c => c.className && c.className.match(/col-/)
    ).length;
    if (colCount >= 2) {
      row = r;
      break;
    }
  }
  if (!row) return;

  // Find the columns
  const columns = Array.from(row.children).filter(
    c => c.className && c.className.match(/col-/)
  );
  if (columns.length < 2) return;

  const headerRow = ['Columns (columns29)'];

  // For each column, extract its main content
  const contentRow = columns.map((col, idx) => {
    // If the column contains only one child div, use that child
    const innerDivs = getImmediateDivs(col);
    let content = innerDivs.length === 1 ? innerDivs[0] : col;

    // Ensure the visible heading is included if present
    // For the text column (usually the wider one), prepend the visible heading if present
    // The text column is usually the one with more text nodes
    const h2s = Array.from(content.querySelectorAll('h2'));
    let visibleH2 = null;
    for (const h2 of h2s) {
      const style = h2.getAttribute('style') || '';
      if (!/display\s*:\s*none/.test(style)) {
        visibleH2 = h2;
        break;
      }
    }
    if (visibleH2) {
      const frag = document.createDocumentFragment();
      frag.appendChild(visibleH2.cloneNode(true));
      Array.from(content.childNodes).forEach(node => {
        if (node !== visibleH2) frag.appendChild(node.cloneNode(true));
      });
      content = frag;
    }
    return content;
  });

  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(block);
}
