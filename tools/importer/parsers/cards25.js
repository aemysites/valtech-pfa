/* global WebImporter */
export default function parse(element, { document }) {
  // Table header
  const headerRow = ['Cards (cards25)'];
  const rows = [headerRow];

  // Helper to extract a card from a .col-xs-12.col-sm-6
  function extractCard(col) {
    const teaser = col.querySelector('.teasers__teaser');
    if (!teaser) return null;
    // Title
    const titleEl = teaser.querySelector('.accordions__toggler');
    // Content
    const contentEl = teaser.querySelector('.accordions__element');
    let descEl = null;
    let imgEl = null;
    if (contentEl) {
      const textCol = contentEl.querySelector('.col-sm-10 .teasers__teaser');
      if (textCol) {
        const ps = Array.from(textCol.querySelectorAll('p'));
        if (ps.length) {
          descEl = document.createElement('div');
          ps.forEach(p => descEl.appendChild(p.cloneNode(true)));
        }
      }
      const imgCol = contentEl.querySelector('.col-sm-2 img');
      if (imgCol) imgEl = imgCol;
    }
    if (!imgEl) {
      const fallbackImg = teaser.querySelector('img');
      if (fallbackImg) imgEl = fallbackImg;
    }
    if (!descEl && titleEl) {
      let next = titleEl.nextElementSibling;
      descEl = document.createElement('div');
      while (next) {
        if (next.tagName === 'P') {
          descEl.appendChild(next.cloneNode(true));
        }
        next = next.nextElementSibling;
      }
      if (!descEl.hasChildNodes()) descEl = null;
    }
    const textCell = [];
    if (titleEl) {
      const heading = document.createElement('strong');
      heading.textContent = titleEl.textContent.trim();
      textCell.push(heading);
    }
    if (descEl) {
      textCell.push(descEl);
    }
    if (imgEl && textCell.length) {
      return [imgEl.cloneNode(true), textCell];
    }
    return null;
  }

  // Extract all cards from all .row > .col-xs-12.col-sm-6, but only add unique cards
  const seenTitles = new Set();
  element.querySelectorAll('.row').forEach((rowEl) => {
    rowEl.querySelectorAll('.col-xs-12.col-sm-6').forEach((col) => {
      const card = extractCard(col);
      if (card) {
        const title = card[1][0]?.textContent?.trim();
        if (title && !seenTitles.has(title)) {
          seenTitles.add(title);
          rows.push(card);
        }
      }
    });
  });

  // Extract all top-level non-card text blocks as their own cards
  let node = element.firstChild;
  while (node) {
    // Stop at the first .row (cards start here)
    if (node.nodeType === 1 && node.classList.contains('row')) break;
    if (node.nodeType === 1 && node.textContent.trim() && node.tagName !== 'BR') {
      // Treat each intro block as a card with text only (no image)
      rows.push(['', [node.cloneNode(true)]]);
    }
    node = node.nextSibling;
  }

  // Extract all bottom-level non-card text blocks as their own cards
  const allRows = Array.from(element.querySelectorAll('.row'));
  let lastRow = allRows.length ? allRows[allRows.length - 1] : null;
  node = lastRow ? lastRow.nextSibling : null;
  while (node) {
    if (node.nodeType === 1 && node.textContent.trim() && node.tagName !== 'BR') {
      rows.push(['', [node.cloneNode(true)]]);
    }
    node = node.nextSibling;
  }

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
