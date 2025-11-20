/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract column content
  function extractColumn(col) {
    // Extract video embed (iframe), heading, and description
    const teasers = col.querySelectorAll('.teasers__teaser');
    let videoLink = null;
    let heading = null;
    let description = null;

    // Find iframe (video embed) and convert to link
    if (teasers[0]) {
      const iframe = teasers[0].querySelector('iframe');
      if (iframe) {
        videoLink = document.createElement('a');
        videoLink.href = iframe.src;
        videoLink.textContent = 'Video';
      }
    }

    // Find heading (h5)
    heading = col.querySelector('h5');
    // Find description (second teaser)
    description = teasers[2] || teasers[1]; // Defensive: sometimes only two teasers

    // Compose cell content
    const cellContent = [];
    if (videoLink) cellContent.push(videoLink);
    if (heading) cellContent.push(heading);
    if (description) cellContent.push(description);
    return cellContent;
  }

  // Get the two columns
  const columns = element.querySelectorAll(':scope > div');
  if (columns.length < 2) return;

  // Table header
  const headerRow = ['Columns (columns113)'];
  // Table content row
  const contentRow = [extractColumn(columns[0]), extractColumn(columns[1])];

  // Build table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
