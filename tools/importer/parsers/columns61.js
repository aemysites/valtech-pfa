/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as header row
  const headerRow = ['Columns (columns61)'];

  // Defensive: get all immediate column divs (should be three)
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Each column contains a .teasers__teaser > blockquote
  const contentRow = columns.map(col => {
    // Find the teaser block in each column
    const teaser = col.querySelector('.teasers__teaser');
    if (teaser) {
      // Use the blockquote (the entire testimonial block)
      const blockquote = teaser.querySelector('blockquote');
      if (blockquote) {
        return blockquote;
      }
      // Fallback: use the whole teaser if blockquote missing
      return teaser;
    }
    // Fallback: use the whole column if teaser missing
    return col;
  });

  // Compose table rows
  const rows = [headerRow, contentRow];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
