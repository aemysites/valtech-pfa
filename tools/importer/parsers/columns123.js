/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Columns block
  const headerRow = ['Columns (columns123)'];

  // Get the introductory statement before the .row
  let introText = '';
  let introNode = element.firstChild;
  while (introNode) {
    if (introNode.nodeType === Node.TEXT_NODE && introNode.textContent.trim()) {
      introText = introNode.textContent.trim();
      break;
    }
    introNode = introNode.nextSibling;
  }

  // Defensive: Get all direct .row children (the columns container)
  const row = element.querySelector('.row');
  if (!row) return;

  // Get all direct column divs
  const columns = Array.from(row.querySelectorAll(':scope > div'));
  if (columns.length !== 3) return;

  // --- Column 1: Bio/Career Info ---
  const col1 = columns[0];
  const col1Content = Array.from(col1.children);
  if (introText) {
    const introP = document.createElement('p');
    introP.textContent = introText;
    col1Content.unshift(introP);
  }

  // --- Column 2: Board/Advisory Info ---
  const col2 = columns[1];
  const col2CellContent = [];
  // Find all sections: headings and their following lists
  // 1. Tillidshverv:
  const tillidshvervP = col2.querySelector('p.teasers__teaser');
  if (tillidshvervP) col2CellContent.push(tillidshvervP);

  // 2. Bestyrelsesformand i:
  let bfTextNode = null;
  for (const node of col2.childNodes) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent.includes('Bestyrelsesformand i:')) {
      bfTextNode = node;
      break;
    }
  }
  if (bfTextNode) {
    const bfP = document.createElement('p');
    bfP.textContent = bfTextNode.textContent.trim();
    col2CellContent.push(bfP);
  }
  const bfList = col2.querySelector('div.teasers__teaser ul');
  if (bfList) col2CellContent.push(bfList);

  // 3. Bestyrelsesmedlem i:
  let bmTextNode = null;
  let bmList = null;
  for (const node of col2.childNodes) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent.includes('Bestyrelsesmedlem i:')) {
      bmTextNode = node;
    }
    if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'UL' && node.previousSibling && node.previousSibling.textContent && node.previousSibling.textContent.includes('Bestyrelsesmedlem i:')) {
      bmList = node;
    }
  }
  if (bmTextNode) {
    const bmP = document.createElement('p');
    bmP.textContent = bmTextNode.textContent.trim();
    col2CellContent.push(bmP);
  }
  // The next UL after Bestyrelsesmedlem i:
  const bmListEl = Array.from(col2.querySelectorAll('ul')).find(ul => Array.from(ul.previousSibling ? [ul.previousSibling] : []).some(n => n.nodeType === Node.TEXT_NODE && n.textContent.includes('Bestyrelsesmedlem i:')));
  if (bmListEl) col2CellContent.push(bmListEl);

  // 4. Medlem af:
  let maTextNode = null;
  let maList = null;
  for (const node of col2.childNodes) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent.includes('Medlem af:')) {
      maTextNode = node;
    }
  }
  if (maTextNode) {
    const maP = document.createElement('p');
    maP.textContent = maTextNode.textContent.trim();
    col2CellContent.push(maP);
  }
  // The next UL after Medlem af:
  const maListEl = Array.from(col2.querySelectorAll('ul')).find(ul => Array.from(ul.previousSibling ? [ul.previousSibling] : []).some(n => n.nodeType === Node.TEXT_NODE && n.textContent.includes('Medlem af:')));
  // If not found, just use the last UL
  if (maListEl) {
    col2CellContent.push(maListEl);
  } else {
    const uls = Array.from(col2.querySelectorAll('ul'));
    if (uls.length) col2CellContent.push(uls[uls.length - 1]);
  }

  // --- Column 3: Image & Caption ---
  const col3 = columns[2];
  const imgDiv = col3.querySelector('.teasers__teaser');
  let col3CellContent = [];
  if (imgDiv) {
    const img = imgDiv.querySelector('img');
    if (img) col3CellContent.push(img);
    const caption = imgDiv.querySelector('span');
    if (caption) col3CellContent.push(caption);
  }

  // Build the table rows
  const rows = [
    headerRow,
    [col1Content, col2CellContent, col3CellContent]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
