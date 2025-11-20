/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Columns block
  const headerRow = ['Columns (columns111)'];

  // Defensive: Get immediate column divs
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // --- LEFT COLUMN ---
  let leftCellContent = [];
  if (columns[0]) {
    const teaser = columns[0].querySelector('.teasers__teaser');
    if (teaser) {
      // Blockquote (quote)
      const blockquote = teaser.querySelector('blockquote');
      if (blockquote) leftCellContent.push(blockquote);
      // Supporting paragraph (exclude blockquote's <p>)
      const paras = Array.from(teaser.querySelectorAll('p')).filter(p => !blockquote || !blockquote.contains(p));
      paras.forEach(p => leftCellContent.push(p));
    }
  }

  // --- RIGHT COLUMN ---
  let rightCellContent = [];
  if (columns[1]) {
    const teaser = columns[1].querySelector('.teasers__teaser');
    if (teaser) {
      // Find the video wrapper (contains iframe)
      const videoWrapper = teaser.querySelector('div');
      if (videoWrapper) {
        // Find iframe
        const iframe = videoWrapper.querySelector('iframe');
        if (iframe) {
          // Embed: represent as a link to its src
          const videoLink = document.createElement('a');
          videoLink.href = iframe.src;
          videoLink.textContent = 'Video';
          rightCellContent.push(videoLink);
        }
      }
    }
  }

  // Ensure both columns exist for the row
  const row = [leftCellContent, rightCellContent];

  // Build table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    row
  ], document);

  // Replace element
  element.replaceWith(table);
}
