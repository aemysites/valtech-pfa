/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards25) block: 2 columns, first row is block name, each card = [image, text]
  const headerRow = ['Cards (cards25)'];
  const rows = [headerRow];

  // Helper to extract all introductory/explanatory text blocks
  function extractIntro(parent) {
    const introBlocks = [];
    // Find all top-level <p> and <strong> (not inside teasers or accordions)
    parent.childNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE && (node.tagName === 'P' || node.tagName === 'STRONG')) {
        if (!node.closest('.teasers__teaser') && !node.closest('.accordions__element')) {
          const div = document.createElement('div');
          div.appendChild(node.cloneNode(true));
          introBlocks.push(div);
        }
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        // Only push text nodes that are not just whitespace
        const div = document.createElement('div');
        div.textContent = node.textContent.trim();
        introBlocks.push(div);
      }
    });
    return introBlocks;
  }

  // Helper to extract cards from repeated structure
  function extractCards(parent) {
    const cards = [];
    parent.querySelectorAll('.row').forEach(row => {
      row.querySelectorAll('.col-xs-12.col-sm-6').forEach(cardCol => {
        const teaser = cardCol.querySelector('.teasers__teaser');
        if (!teaser) return;
        const titleEl = teaser.querySelector('.accordions__toggler');
        let descEl = null;
        let imgEl = null;
        const elementEl = teaser.querySelector('.accordions__element');
        if (elementEl) {
          const descCol = elementEl.querySelector('.col-xs-12.col-sm-10 .teasers__teaser');
          if (descCol) {
            const descDiv = document.createElement('div');
            descCol.childNodes.forEach(node => {
              if (node.nodeType === Node.ELEMENT_NODE && (node.tagName === 'P' || node.tagName === 'BR')) {
                descDiv.appendChild(node.cloneNode(true));
              } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                descDiv.appendChild(document.createTextNode(node.textContent));
              }
            });
            descEl = descDiv;
          }
          const imgTeaser = elementEl.querySelector('.col-xs-12.col-sm-2 .teasers__teaser img');
          if (imgTeaser) imgEl = imgTeaser;
        }
        const textCell = document.createElement('div');
        if (titleEl) {
          const h = document.createElement('strong');
          h.textContent = titleEl.textContent.trim();
          textCell.appendChild(h);
        }
        if (descEl) {
          textCell.appendChild(descEl);
        }
        if (imgEl && textCell.textContent.trim()) {
          cards.push([imgEl, textCell]);
        }
      });
    });
    return cards;
  }

  let mainContent = element;
  const fluid = element.querySelector('.container-fluid');
  if (fluid) mainContent = fluid;

  // Only add intro/explanatory text as a card if there are NO cards with images
  const cards = extractCards(mainContent);
  if (cards.length === 0) {
    const introBlocks = extractIntro(mainContent).filter(intro => intro.textContent.trim());
    introBlocks.forEach(intro => {
      rows.push(['', intro]);
    });
  }
  rows.push(...cards);

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
