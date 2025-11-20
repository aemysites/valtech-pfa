/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the three columns from the .row > .col-xs-12 structure
  const row = element.querySelector('.row');
  const columns = row ? Array.from(row.children) : [];
  const fallbackColumns = columns.length ? columns : (row ? Array.from(row.querySelectorAll(':scope > div')) : []);

  // --- COLUMN 1: Bio and career info ---
  const col1Content = [];
  // Get the intro text node (before .row)
  const introText = Array.from(element.childNodes).find(
    n => n.nodeType === Node.TEXT_NODE && n.textContent.trim()
  );
  if (introText) {
    col1Content.push(document.createTextNode(introText.textContent.trim()));
  }
  const col1 = fallbackColumns[0];
  if (col1) {
    Array.from(col1.querySelectorAll('p, ul')).forEach(el => {
      if (el.textContent.trim()) col1Content.push(el);
    });
  }

  // --- COLUMN 2: Board memberships and committees ---
  const col2Content = [];
  const col2 = fallbackColumns[1];
  if (col2) {
    // Find the paragraphs and lists in correct order, preserving labels before lists
    let nodes = Array.from(col2.childNodes);
    nodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.tagName === 'P' && node.textContent.trim()) {
          col2Content.push(node);
        }
        if (node.tagName === 'UL' && node.textContent.trim()) {
          col2Content.push(node);
        }
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        col2Content.push(document.createTextNode(node.textContent.trim()));
      }
    });
  }

  // --- COLUMN 3: Image and credit ---
  const col3Content = [];
  const col3 = fallbackColumns[2];
  if (col3) {
    const teaser = col3.querySelector('.teasers__teaser');
    if (teaser) {
      const img = teaser.querySelector('img');
      if (img) col3Content.push(img);
      // Find the credit (span > em) and preserve the <em> tag
      const creditEm = teaser.querySelector('span em');
      if (creditEm) {
        const creditSpan = document.createElement('span');
        const em = document.createElement('em');
        em.textContent = creditEm.textContent;
        creditSpan.appendChild(em);
        col3Content.push(creditSpan);
      }
    }
  }

  // Compose table rows
  const headerRow = ['Columns (columns124)'];
  const contentRow = [col1Content, col2Content, col3Content];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
