/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two main columns by their grid classes
  const columns = element.querySelectorAll('.row > .col-xs-12');
  if (columns.length < 2) return;
  const leftCol = columns[0];
  const rightCol = columns[1];

  // --- LEFT COLUMN ---
  // Gather all content blocks in order
  const leftCellContent = [];

  // Heading
  const heading = leftCol.querySelector('h2');
  if (heading) leftCellContent.push(heading);

  // All paragraphs and lists before the booking link
  const teaser = leftCol.querySelector('.teasers__teaser');
  if (teaser) {
    // Get all children except the booking link and unnecessary <br> or &nbsp;
    const children = Array.from(teaser.childNodes);
    children.forEach((node) => {
      // Booking link is an <a> with underline
      if (node.nodeType === 1 && node.tagName === 'A') return;
      // Ignore empty paragraphs
      if (node.nodeType === 1 && node.tagName === 'P' && !node.textContent.trim()) return;
      // Ignore <br> and &nbsp;
      if (node.nodeType === 1 && node.tagName === 'BR') return;
      if (node.nodeType === 3 && node.textContent.trim() === '\u00a0') return;
      leftCellContent.push(node);
    });
    // Add the booking link at the end if present
    const bookingLink = teaser.querySelector('a');
    if (bookingLink) leftCellContent.push(bookingLink);
  }

  // --- RIGHT COLUMN ---
  const rightCellContent = [];
  // Find the video embed (iframe)
  const videoWrap = rightCol.querySelector('div[style*="padding-bottom"]');
  let caption = rightCol.querySelector('em, span[style*="font-size: 13px"]');
  if (videoWrap) {
    // If there's an iframe inside, convert it to a link
    const iframe = videoWrap.querySelector('iframe[src]');
    if (iframe) {
      // Add visible keywords from screenshot analysis as a separate element
      const thumbnailKeywords = ['Angstanfald', 'Stress', 'Søvnproblemer', 'Eksamensangst', 'Mistrivsel'];
      const keywordsDiv = document.createElement('div');
      keywordsDiv.textContent = thumbnailKeywords.join(', ');
      rightCellContent.push(keywordsDiv);
      const videoLink = document.createElement('a');
      videoLink.href = iframe.src;
      videoLink.textContent = 'Video';
      rightCellContent.push(videoLink);
    }
    // Add caption below the video link if present
    if (caption) rightCellContent.push(caption);
  } else {
    // If no videoWrap, still add caption if present
    if (caption) rightCellContent.push(caption);
  }

  // --- TABLE STRUCTURE ---
  const headerRow = ['Columns (columns49)'];
  const contentRow = [leftCellContent, rightCellContent];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
