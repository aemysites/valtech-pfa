/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Columns (columns14)'];

  // Find the two main column elements
  const colDivs = Array.from(element.querySelectorAll(':scope .row.teasers > .col-sm-12 > .col-sm-6'));
  const columns = colDivs.length === 2 ? colDivs : Array.from(element.querySelectorAll(':scope .row.teasers > .col-sm-6'));

  // Defensive: handle missing columns
  const leftCol = columns[0];
  const rightCol = columns[1];

  // LEFT COLUMN: heading, list, paragraph
  let leftContent = [];
  if (leftCol) {
    // Heading
    const heading = leftCol.querySelector('h2');
    if (heading) leftContent.push(heading);
    // List
    const list = leftCol.querySelector('ul');
    if (list) leftContent.push(list);
    // Paragraph
    const para = leftCol.querySelector('p');
    if (para) leftContent.push(para);
  }
  if (leftContent.length === 0) leftContent = [''];

  // RIGHT COLUMN: video embed (convert iframe to link), include caption if present
  let rightContent = [];
  if (rightCol) {
    // Find iframe
    const iframeWrap = rightCol.querySelector('div');
    if (iframeWrap) {
      const iframe = iframeWrap.querySelector('iframe');
      if (iframe) {
        // Convert iframe src to a link
        const videoLink = document.createElement('a');
        videoLink.href = iframe.src;
        videoLink.textContent = iframe.src;
        rightContent.push(videoLink);
      }
      // Check for caption/subtitle below the video
      // Try inside the wrapper first
      let caption = iframeWrap.querySelector('p, span');
      // If not found, try next sibling
      if (!caption) {
        let next = iframeWrap.nextElementSibling;
        // Only push if caption contains non-empty text
        if (next && (next.tagName === 'P' || next.tagName === 'SPAN' || next.tagName === 'DIV') && next.textContent.trim()) {
          caption = next;
        }
      }
      if (caption && caption.textContent.trim()) {
        rightContent.push(caption);
      }
    }
  }
  if (rightContent.length === 0) rightContent = [''];

  // Build the table rows
  const rows = [
    headerRow,
    [leftContent, rightContent]
  ];

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
