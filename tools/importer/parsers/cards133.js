/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card content from a card column
  function extractCardContent(cardCol, headingText) {
    // Find image
    const img = cardCol.querySelector('img');

    // Use headingText (from h4) for all cards
    const heading = document.createElement('strong');
    heading.textContent = headingText;

    // Find toggler CTA (call-to-action)
    let togglerText = '';
    const toggler = cardCol.querySelector('.accordions__toggler .more');
    if (toggler) {
      togglerText = toggler.textContent.trim();
    }

    // Find all links in this card (prefer links inside accordion)
    let links = [];
    const accordion = cardCol.querySelector('.read-more');
    if (accordion) {
      links = Array.from(accordion.querySelectorAll('a'));
    } else {
      links = Array.from(cardCol.querySelectorAll('a'));
    }

    // Compose text cell: heading, toggler CTA, then links (each on its own line)
    const textCell = document.createElement('div');
    textCell.appendChild(heading);
    textCell.appendChild(document.createElement('br'));
    if (togglerText) {
      textCell.appendChild(document.createTextNode(togglerText));
      textCell.appendChild(document.createElement('br'));
    }
    links.forEach((link, i) => {
      textCell.appendChild(link);
      if (i < links.length - 1) {
        textCell.appendChild(document.createElement('br'));
      }
    });
    return [img, textCell];
  }

  // Gather all h4 headings (including the one for Positionspapirer)
  const allH4s = Array.from(element.querySelectorAll('h4'));
  // Gather all card columns
  const cardCols = Array.from(element.querySelectorAll('.col-xs-12.col-sm-3')).filter(col => col.querySelector('img'));

  // Build rows: header + one row per card
  const rows = [];
  rows.push(['Cards (cards133)']);
  cardCols.forEach((cardCol, idx) => {
    // Use corresponding h4 text for each card
    const headingText = allH4s[idx] ? allH4s[idx].textContent.trim() : '';
    rows.push(extractCardContent(cardCol, headingText));
  });

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace original element
  element.replaceWith(block);
}
