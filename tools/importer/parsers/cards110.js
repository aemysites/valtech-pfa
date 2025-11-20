/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the required header row for Cards (cards110)
  const headerRow = ['Cards (cards110)'];
  const rows = [headerRow];

  // Find all card columns (ignore empty columns)
  // Cards are in .col-md-3, each representing a card
  const cardColumns = Array.from(element.querySelectorAll('.col-md-3'));

  cardColumns.forEach(col => {
    // Find the image (mandatory)
    let img = col.querySelector('img');
    if (!img) {
      const imgLink = col.querySelector('a img');
      if (imgLink) img = imgLink;
    }

    // Find the title (usually in a <span> or <p> with font-size)
    let title = col.querySelector('span[style*="font-size"]');
    if (!title) {
      const ps = Array.from(col.querySelectorAll('p'));
      title = ps.find(p => !p.querySelector('a') && p.textContent.trim());
    }
    let titleElem = title ? title : null;

    // Find CTA link (usually 'Læs mere') and preserve all text including chevrons/arrows
    let cta = null;
    // Look for <a> with 'Læs mere' in text
    const links = Array.from(col.querySelectorAll('a'));
    cta = links.find(a => /Læs mere/i.test(a.textContent));
    if (!cta) {
      const ctaP = Array.from(col.querySelectorAll('p')).find(p => /Læs mere/i.test(p.textContent));
      if (ctaP) cta = ctaP.querySelector('a');
    }
    // If CTA exists, preserve any trailing text (› or >) from parent <p>
    if (cta) {
      const parentP = cta.closest('p');
      if (parentP) {
        // Compose full CTA text: <a> text plus any trailing text node
        let fullText = cta.textContent;
        let node = cta.nextSibling;
        let trailing = '';
        while (node) {
          if (node.nodeType === Node.TEXT_NODE) {
            trailing += node.textContent;
          }
          node = node.nextSibling;
        }
        if (trailing.trim()) {
          fullText += trailing.trim();
        }
        // If the fullText differs, clone the <a> and set correct text
        if (fullText !== cta.textContent) {
          const newCta = cta.cloneNode(true);
          newCta.textContent = fullText;
          cta = newCta;
        }
      }
    }

    // Compose the text cell: title (as heading), then CTA
    const textCell = document.createElement('div');
    if (titleElem) {
      const heading = document.createElement('strong');
      heading.textContent = titleElem.textContent.trim();
      textCell.appendChild(heading);
    }
    if (cta) {
      if (titleElem) textCell.appendChild(document.createElement('br'));
      textCell.appendChild(cta);
    }

    // Add the row: [image, textCell]
    rows.push([
      img ? img : '',
      textCell
    ]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
