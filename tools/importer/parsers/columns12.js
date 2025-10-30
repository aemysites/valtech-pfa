/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns12)'];

  // --- HERO SECTION ---
  // Find the hero panel (desktop version preferred)
  const heroPanel = element.querySelector('.narrow-hero__panel--desktop') || element.querySelector('.narrow-hero__panel--mobile');
  let heroContent = [];
  if (heroPanel) {
    // Get image
    const imgDiv = heroPanel.querySelector('.panel__image');
    if (imgDiv) {
      const img = imgDiv.querySelector('img');
      if (img) heroContent.push(img.cloneNode(true));
    }
    // Get all body content (kicker, headline, cta)
    const body = heroPanel.querySelector('.panel__body');
    if (body) {
      Array.from(body.children).forEach((node) => {
        heroContent.push(node.cloneNode(true));
      });
    }
  }
  if (heroContent.length === 0 && heroPanel && heroPanel.textContent.trim()) {
    heroContent.push(document.createTextNode(heroPanel.textContent.trim()));
  }

  // --- COLUMNS SECTION ---
  // Only use .col-sm-6.col-md-4 columns that are NOT inside the hero
  const heroCol = element.querySelector('.narrow-hero');
  const allCols = Array.from(element.querySelectorAll('.col-sm-6.col-md-4'));
  const filteredCols = allCols.filter(col => !heroCol || !heroCol.contains(col));
  let columnsRow = [];
  if (filteredCols.length >= 3) {
    columnsRow = filteredCols.slice(0, 3).map((col) => {
      const panel = col.querySelector('.panel');
      const contentSource = panel || col;
      let content = [];
      Array.from(contentSource.children).forEach(node => {
        content.push(node.cloneNode(true));
      });
      Array.from(contentSource.childNodes).forEach(node => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          content.push(document.createTextNode(node.textContent));
        }
      });
      if (content.length === 0 && contentSource.textContent.trim()) {
        content.push(document.createTextNode(contentSource.textContent.trim()));
      }
      return content.length === 1 ? content[0] : content;
    });
  }

  // Compose table rows: header, then columns row (with hero content prepended to first column)
  if (columnsRow.length === 3 && heroContent.length) {
    // Prepend hero content to the first column
    columnsRow[0] = Array.isArray(columnsRow[0]) ? [...heroContent, ...columnsRow[0]] : [...heroContent, columnsRow[0]];
  }
  const cells = [headerRow];
  if (columnsRow.length === 3) cells.push(columnsRow);

  // Only replace if we have the columns
  if (cells.length > 1 && columnsRow.length === 3) {
    const block = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(block);
  }
}
