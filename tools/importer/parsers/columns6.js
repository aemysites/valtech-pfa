/* global WebImporter */
export default function parse(element, { document }) {
  // Always start with the block name header
  const headerRow = ['Columns (columns6)'];

  // Get all immediate column divs (col-xs-12 col-sm-*)
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Defensive: fallback to all children if no columns found
  const colCount = columns.length || 2;

  // For each column, extract all teaser blocks and combine their content
  function extractColumnContent(col) {
    // Get all .teasers__teaser elements in this column
    const teasers = Array.from(col.querySelectorAll('.teasers__teaser'));
    if (teasers.length === 0) return col.cloneNode(true);
    // For left column: merge all teasers into one cell
    if (teasers.length > 1) {
      const wrapper = document.createElement('div');
      teasers.forEach(teaser => {
        // If teaser contains only an image, append image
        const img = teaser.querySelector('img');
        if (img && teaser.children.length === 1 && !teaser.textContent.trim()) {
          wrapper.appendChild(img.cloneNode(true));
        } else {
          // Otherwise, append all children (preserving paragraphs, lists, links)
          Array.from(teaser.childNodes).forEach(child => {
            wrapper.appendChild(child.cloneNode(true));
          });
        }
      });
      return wrapper;
    }
    // For right column: image only
    if (teasers.length === 1) {
      const teaser = teasers[0];
      const img = teaser.querySelector('img');
      if (img && teaser.children.length === 1 && !teaser.textContent.trim()) {
        return img.cloneNode(true);
      }
      // Otherwise, return all children
      const wrapper = document.createElement('div');
      Array.from(teaser.childNodes).forEach(child => {
        wrapper.appendChild(child.cloneNode(true));
      });
      return wrapper;
    }
    // Fallback: clone column
    return col.cloneNode(true);
  }

  // Build the first content row (columns)
  const firstContentRow = columns.map(extractColumnContent);

  // Create the table structure
  const cells = [headerRow, firstContentRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
