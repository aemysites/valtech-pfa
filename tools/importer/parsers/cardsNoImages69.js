/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cardsNoImages69) block parsing
  // Helper to get visible text from a button (with <br> replaced by space)
  function getButtonText(btn) {
    if (!btn) return '';
    // Clone to avoid mutating original
    const clone = btn.cloneNode(true);
    // Replace <br> with space
    clone.innerHTML = clone.innerHTML.replace(/<br\s*\/?>(\s*)?/gi, ' ');
    return clone.textContent.trim();
  }

  // Find the nav container with the cards
  const nav = element.querySelector('#omkostningsNav');
  if (!nav) return;
  const cardDivs = Array.from(nav.querySelectorAll('.col-md-3.aligncenter'));

  // Compose rows
  const rows = [];
  // Header row
  rows.push(['Cards (cardsNoImages69)']);

  // For each card, extract all visible text content
  cardDivs.forEach(cardDiv => {
    // Find button (heading)
    const btn = cardDiv.querySelector('button');
    let heading = '';
    if (btn) {
      heading = getButtonText(btn);
    }
    // Find description (introtekst)
    const descDiv = cardDiv.querySelector('.introtekst');
    let description = '';
    if (descDiv) {
      description = descDiv.textContent.trim();
    }
    // Compose card cell: include all text content
    const cell = document.createElement('div');
    if (heading) {
      const h = document.createElement('strong');
      h.textContent = heading;
      cell.appendChild(h);
      cell.appendChild(document.createElement('br'));
    }
    if (description) {
      const p = document.createElement('p');
      p.textContent = description;
      cell.appendChild(p);
    }
    // If there is any other visible text node directly under cardDiv, include it
    Array.from(cardDiv.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        const span = document.createElement('span');
        span.textContent = node.textContent.trim();
        cell.appendChild(span);
      }
    });
    rows.push([cell]);
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace element
  element.replaceWith(block);
}
