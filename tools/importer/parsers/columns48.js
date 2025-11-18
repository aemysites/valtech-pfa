/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main row containing the two columns
  const mainRow = element.querySelector('.row.teasers > .col-sm-12 > .row');
  if (!mainRow) return;
  const columns = mainRow.querySelectorAll(':scope > div');
  if (columns.length < 2) return;

  // --- LEFT COLUMN ---
  const leftCol = columns[0];
  // Find the VISIBLE heading for the left column
  let heading = leftCol.querySelector('h2');
  // Only use the visible heading (not the hidden .teasers__heading)
  if (!heading) heading = leftCol.firstElementChild;

  // Gather all .teasers__teaser blocks and paragraphs/lists not inside .teasers__teaser
  const teaserBlocks = Array.from(leftCol.querySelectorAll('.teasers__teaser'));
  const extraParas = Array.from(leftCol.querySelectorAll(':scope > p, :scope > ul')).filter(el => !el.closest('.teasers__teaser'));
  // Remove empty paragraphs and empty teaser blocks
  const leftContent = [];
  if (heading && heading.textContent.trim()) leftContent.push(heading);
  teaserBlocks.forEach(tb => {
    if (tb.textContent.trim()) leftContent.push(tb);
  });
  extraParas.forEach(p => {
    if (p.textContent.trim()) leftContent.push(p);
  });

  // --- RIGHT COLUMN ---
  const rightCol = columns[1];
  const rightTeaser = rightCol.querySelector('.teasers__teaser');
  let rightContent = [];
  if (rightTeaser) {
    // Add <br> tags before video if present in original
    Array.from(rightTeaser.childNodes).forEach(node => {
      if (node.nodeType === 1 && node.tagName === 'BR') rightContent.push(node.cloneNode());
    });
    // Find iframe (video embed)
    const videoEmbed = rightTeaser.querySelector('iframe');
    if (videoEmbed) {
      // Convert iframe to a link as required
      const videoLink = document.createElement('a');
      videoLink.href = videoEmbed.src;
      videoLink.textContent = 'Video Player';
      rightContent.push(videoLink);
    }
    // Find caption (em or span)
    const videoCaption = rightTeaser.querySelector('em, span');
    if (videoCaption) rightContent.push(videoCaption);
  } else {
    // Fallback: just use all children, but convert any iframe to link
    rightContent = Array.from(rightCol.children).map(child => {
      if (child.tagName === 'IFRAME' && child.src) {
        const videoLink = document.createElement('a');
        videoLink.href = child.src;
        videoLink.textContent = 'Video Player';
        return videoLink;
      }
      return child;
    });
  }

  // Table structure
  const headerRow = ['Columns (columns48)'];
  const contentRow = [leftContent, rightContent];
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
