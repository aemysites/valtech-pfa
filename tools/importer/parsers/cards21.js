/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards21) block: 2 columns, header row, each row = card (image/icon, text content)
  const headerRow = ['Cards (cards21)'];
  const rows = [headerRow];

  // Find all card columns (each .col-xs-12.col-sm-4 is a card)
  const cardColumns = element.querySelectorAll('.col-xs-12.col-sm-4');

  cardColumns.forEach((col) => {
    const teaser = col.querySelector('.teasers__teaser');
    if (!teaser) return;

    // Find all images inside the teaser (first is background, second is icon)
    const images = teaser.querySelectorAll('img');
    let cardImage = null;
    if (images.length > 1) {
      // Compose a fragment with both images (background and icon)
      const frag = document.createDocumentFragment();
      frag.appendChild(images[0].cloneNode(true));
      frag.appendChild(images[1].cloneNode(true));
      cardImage = frag;
    } else if (images.length === 1) {
      cardImage = images[0].cloneNode(true);
    }

    // Heading
    const heading = teaser.querySelector('h3');
    // Description: all <p> except those that only contain a CTA link
    const paragraphs = Array.from(teaser.querySelectorAll('p'));
    let descriptionEls = [];
    let ctaEl = null;
    paragraphs.forEach((p) => {
      const link = p.querySelector('a');
      if (link && link.textContent.trim().length > 0 && p.textContent.trim().replace(/»/g, '').trim() === link.textContent.trim()) {
        ctaEl = link.cloneNode(true);
        // Add trailing » if not present
        if (!ctaEl.textContent.trim().endsWith('»')) {
          ctaEl.textContent = ctaEl.textContent.trim() + ' »';
        }
      } else {
        descriptionEls.push(p.cloneNode(true));
      }
    });

    // Compose text cell: heading, description, CTA (only if CTA is a real link in HTML)
    const textCell = [];
    if (heading) textCell.push(heading.cloneNode(true));
    descriptionEls.forEach((desc) => textCell.push(desc));
    if (ctaEl) textCell.push(ctaEl);

    rows.push([
      cardImage,
      textCell
    ]);
  });

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
