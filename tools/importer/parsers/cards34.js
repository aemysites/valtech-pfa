/* global WebImporter */
export default function parse(element, { document }) {
  // Always start with the block header row
  const headerRow = ['Cards (cards34)'];
  const rows = [headerRow];

  // Find all columns that represent cards
  const cols = element.querySelectorAll('.col-xs-12.col-sm-4');
  cols.forEach(col => {
    // Find image/icon (first img in col)
    const img = col.querySelector('img');
    if (!img) return;
    // Find heading (h3 or h4)
    const heading = col.querySelector('h3, h4');
    // Find ALL possible description blocks for this card
    // For each card, collect all .teasers__teaser divs that are not heading or image
    const teaserDivs = Array.from(col.querySelectorAll('.teasers__teaser'));
    const descriptionBlocks = teaserDivs.filter(div => {
      // Exclude divs that contain an img or heading
      return !div.querySelector('img') && !div.querySelector('h3, h4') && div.textContent.trim();
    });
    // Also include any <p> that is not inside a heading block
    const paragraphs = Array.from(col.querySelectorAll('p')).filter(p => p.textContent.trim());
    // Compose text cell: heading + all description blocks (preserve order)
    const cellContent = [];
    if (heading) cellContent.push(heading);
    // Add all description blocks (divs and paragraphs)
    descriptionBlocks.forEach(desc => cellContent.push(desc));
    paragraphs.forEach(p => {
      // Avoid duplicates: only add if not already present
      if (!cellContent.includes(p)) cellContent.push(p);
    });
    // Only add row if we have both image and text content
    if (img && cellContent.length > 1) {
      rows.push([img, cellContent]);
    }
  });

  // Only output the table if there are card rows
  if (rows.length > 1) {
    const table = WebImporter.DOMUtils.createTable(rows, document);
    element.replaceWith(table);
  }
}
