/* global WebImporter */
export default function parse(element, { document }) {
  // Extract heading (h1)
  const heading = element.querySelector('h1');
  // Extract quote (blockquote > p)
  const quote = element.querySelector('blockquote p');
  // Find CTA button (link at bottom)
  const ctaContainer = element.querySelector('.col-xs-12.text-center');
  let ctaLink = null;
  if (ctaContainer) {
    ctaLink = ctaContainer.querySelector('a');
  }

  // Header row
  const headerRow = ['Cards (cards79)'];
  const rows = [headerRow];

  // Find all card containers (teasers__teaser)
  const cardEls = element.querySelectorAll('.teasers__teaser');
  cardEls.forEach(cardEl => {
    // Find image (first img in card)
    const img = cardEl.querySelector('img');
    // Find title (first h3 in card)
    const title = cardEl.querySelector('h3');
    // Find all paragraphs (all p in card)
    const paragraphs = Array.from(cardEl.querySelectorAll('p'));
    // Compose text cell: title + paragraphs
    const textCell = [];
    if (title) textCell.push(title);
    if (paragraphs.length) textCell.push(...paragraphs);
    rows.push([img, textCell]);
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Insert heading and quote above the block
  if (heading) heading.remove();
  if (quote) quote.remove();
  block.before(heading);
  block.before(quote);
  // Insert CTA below the block
  if (ctaLink) {
    ctaLink.remove();
    block.after(ctaLink);
  }

  // Replace original element
  element.replaceWith(block);
}
