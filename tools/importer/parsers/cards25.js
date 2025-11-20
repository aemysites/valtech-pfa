/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards25) block header row
  const headerRow = ['Cards (cards25)'];

  // Helper: Extract ALL visible introductory/explanatory text from the main column, including section headings and paragraphs
  const introRows = [];
  const mainCol = element.querySelector('.col-sm-12');
  if (mainCol) {
    let introContent = [];
    let foundFirstCardRow = false;
    Array.from(mainCol.childNodes).forEach((node) => {
      // Stop collecting intro when we hit the first card row
      if (node.nodeType === 1 && node.classList.contains('row')) {
        foundFirstCardRow = true;
      }
      if (foundFirstCardRow) return;
      // Section bar (e.g. Indeksnære fonde)
      if (node.nodeType === 1 && node.classList.contains('accordions__toggler')) {
        introContent.push(node.cloneNode(true));
      } else if (node.nodeType === 1 && node.tagName === 'STRONG') {
        introContent.push(node.cloneNode(true));
      } else if (node.nodeType === 3 && node.textContent.trim()) {
        // Collect all text, including non-p children
        const p = document.createElement('p');
        p.textContent = node.textContent.trim();
        introContent.push(p);
      } else if (node.nodeType === 1 && node.tagName === 'P' && node.textContent.trim()) {
        introContent.push(node.cloneNode(true));
      } else if (node.nodeType === 1 && node.tagName === 'BR') {
        // preserve line breaks between intro paragraphs
        introContent.push(document.createElement('br'));
      }
    });
    // Now, also collect all following siblings after the first card row that are not .row, up to the next .row or end
    let afterIntro = false;
    Array.from(mainCol.childNodes).forEach((node) => {
      if (node.nodeType === 1 && node.classList.contains('row')) {
        afterIntro = true;
        return;
      }
      if (!afterIntro) return;
      // Only collect strong, p, and text nodes that are not inside a .row
      if (node.nodeType === 1 && node.tagName === 'STRONG') {
        introContent.push(node.cloneNode(true));
      } else if (node.nodeType === 3 && node.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = node.textContent.trim();
        introContent.push(p);
      } else if (node.nodeType === 1 && node.tagName === 'P' && node.textContent.trim()) {
        introContent.push(node.cloneNode(true));
      } else if (node.nodeType === 1 && node.tagName === 'BR') {
        introContent.push(document.createElement('br'));
      }
    });
    if (introContent.length) {
      introRows.push(['', introContent]);
    }
  }

  // Also extract explanatory text blocks between card sections (e.g., after first card section, before next row)
  // Find all <strong> tags that are not inside a card row
  const extraIntroRows = [];
  const strongs = element.querySelectorAll('strong');
  strongs.forEach(strong => {
    // If the strong is not inside a .row (card group), treat as section heading
    if (!strong.closest('.row')) {
      let sectionContent = [strong.cloneNode(true)];
      // Get following siblings until next <div.row> or <strong>
      let sibling = strong.nextSibling;
      while (sibling && !(sibling.nodeType === 1 && (sibling.tagName === 'STRONG' || (sibling.classList && sibling.classList.contains('row'))))) {
        if (sibling.nodeType === 3 && sibling.textContent.trim()) {
          const p = document.createElement('p');
          p.textContent = sibling.textContent.trim();
          sectionContent.push(p);
        } else if (sibling.nodeType === 1 && sibling.tagName === 'P' && sibling.textContent.trim()) {
          sectionContent.push(sibling.cloneNode(true));
        } else if (sibling.nodeType === 1 && sibling.tagName === 'BR') {
          sectionContent.push(document.createElement('br'));
        }
        sibling = sibling.nextSibling;
      }
      // Remove empty trailing <br> if present
      while (sectionContent.length && sectionContent[sectionContent.length-1].tagName === 'BR') {
        sectionContent.pop();
      }
      if (sectionContent.length > 0) {
        extraIntroRows.push(['', sectionContent]);
      }
    }
  });

  // Find the main accordion content area (the first .accordions__element after the toggler)
  const accordionElement = element.querySelector('.accordions__element');
  const cardRows = accordionElement ? Array.from(accordionElement.querySelectorAll('.row')) : [];
  const cardCells = [];

  cardRows.forEach(row => {
    // Each row has up to two cards in .col-xs-12.col-sm-6
    const cols = row.querySelectorAll('.col-xs-12.col-sm-6');
    cols.forEach(col => {
      if (!col.textContent.trim()) return;
      const teaser = col.querySelector('.teasers__teaser');
      if (!teaser) return;

      // Title: .accordions__toggler inside teaser
      const titleEl = teaser.querySelector('.accordions__toggler');
      let titleNode = null;
      if (titleEl && titleEl.textContent.trim()) {
        titleNode = document.createElement('strong');
        titleNode.textContent = titleEl.textContent.trim();
      }

      // Description: .accordions__element > .row > .col-xs-12.col-sm-10 > .teasers__teaser > p
      let descNode = null;
      const accordionContent = teaser.querySelector('.accordions__element');
      if (accordionContent) {
        const descCol = accordionContent.querySelector('.col-xs-12.col-sm-10 .teasers__teaser p');
        if (descCol) {
          descNode = descCol.cloneNode(true);
        }
      }

      // Image: .col-xs-12.col-sm-2 .teasers__teaser img
      let imgNode = null;
      if (accordionContent) {
        const imgCol = accordionContent.querySelector('.col-xs-12.col-sm-2 .teasers__teaser img');
        if (imgCol) {
          imgNode = imgCol;
        }
      }

      // Compose card row: [image, text content]
      const textContent = [];
      if (titleNode) textContent.push(titleNode);
      if (descNode) textContent.push(descNode);

      // Only add card if image and description exist (per block spec)
      if (imgNode && textContent.length) {
        cardCells.push([imgNode, textContent]);
      }
    });
  });

  // Build the table rows
  const rows = [headerRow, ...introRows, ...extraIntroRows, ...cardCells];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
