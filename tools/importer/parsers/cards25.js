/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract all introductory and section text, including paragraphs
  function extractIntroContent(mainCol, stopClass) {
    const intro = [];
    let node = mainCol.firstChild;
    while (node) {
      // Stop at the first .row (cards grid) or a specific class
      if (node.nodeType === 1 && node.classList.contains(stopClass)) break;
      if (node.nodeType === 1 && (node.tagName === 'STRONG' || node.tagName === 'BR' || node.tagName === 'P')) {
        intro.push(node.cloneNode(true));
      } else if (node.nodeType === 3 && node.textContent.trim()) {
        intro.push(document.createTextNode(node.textContent));
      }
      node = node.nextSibling;
    }
    return intro;
  }

  // Helper to extract cards from a row
  function extractCardsFromRow(row) {
    const cards = [];
    row.querySelectorAll('.col-xs-12.col-sm-6').forEach((col) => {
      const teaser = col.querySelector('.teasers__teaser');
      if (!teaser) return;
      const title = teaser.querySelector('.accordions__toggler');
      const description = teaser.querySelector('.accordions__element .teasers__teaser p:not(.accordions__toggler)');
      const image = teaser.querySelector('.accordions__element img');
      const textCell = [];
      if (title) {
        const h3 = document.createElement('h3');
        h3.textContent = title.textContent.trim();
        textCell.push(h3);
      }
      if (description) {
        textCell.push(description.cloneNode(true));
      }
      if (image || textCell.length) {
        cards.push([
          image ? image.cloneNode(true) : '',
          textCell.length ? textCell : ''
        ]);
      }
    });
    return cards;
  }

  // Find all .col-xs-12.col-sm-12 blocks (there are two: one for PFA, one for iShares)
  const mainCols = element.querySelectorAll('.col-xs-12.col-sm-12');
  const tableCells = [['Cards (cards25)']];

  // First intro block (PFA-forvaltede indeksnære fonde)
  if (mainCols[0]) {
    const mainHeading = element.querySelector('.accordions__toggler.bg-secondary');
    const intro = [];
    if (mainHeading) {
      const h2 = document.createElement('h2');
      h2.textContent = mainHeading.textContent.trim();
      intro.push(h2);
    }
    intro.push(...extractIntroContent(mainCols[0], 'row'));
    if (intro.length) {
      tableCells.push(['', intro]);
    }
  }

  // Extract all card rows
  const rows = Array.from(element.querySelectorAll('.row')).filter(row => row.querySelector('.col-xs-12.col-sm-6'));
  let cardRows = [];
  const seenTitles = new Set();
  rows.forEach(row => {
    extractCardsFromRow(row).forEach(card => {
      // Deduplicate by card title (h3 text)
      const title = card[1] && card[1][0] && card[1][0].textContent ? card[1][0].textContent.trim() : '';
      if (title && !seenTitles.has(title)) {
        seenTitles.add(title);
        cardRows.push(card);
      }
    });
  });
  tableCells.push(...cardRows);

  // Second intro block (Eksternt forvaltede indeksfonde)
  if (mainCols[0]) {
    // Find the second <strong> (Eksternt forvaltede indeksfonde)
    const strongs = mainCols[0].querySelectorAll('strong');
    if (strongs.length > 1) {
      const secondStrong = strongs[1];
      const intro2 = [secondStrong.cloneNode(true)];
      let node = secondStrong.nextSibling;
      while (node && !(node.nodeType === 1 && node.classList.contains('row'))) {
        if (node.nodeType === 1 && (node.tagName === 'BR' || node.tagName === 'P')) {
          intro2.push(node.cloneNode(true));
        } else if (node.nodeType === 3 && node.textContent.trim()) {
          intro2.push(document.createTextNode(node.textContent));
        }
        node = node.nextSibling;
      }
      if (intro2.length) {
        tableCells.push(['', intro2]);
      }
    }
  }

  const block = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(block);
}
