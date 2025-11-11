/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Columns block
  const headerRow = ['Columns (columns6)'];

  // Get immediate column containers
  const columns = element.querySelectorAll(':scope > div');
  if (columns.length < 2) {
    return;
  }

  // LEFT COLUMN: collect all teaser blocks (text, list, links)
  const leftCol = columns[0];
  const leftTeasers = Array.from(leftCol.querySelectorAll('.teasers__teaser'));
  const leftCellContent = [];

  let phonePara, listBlock;
  leftTeasers.forEach(teaser => {
    const ul = teaser.querySelector('ul');
    if (ul) {
      listBlock = ul.cloneNode(true);
    } else if (teaser.textContent.includes('Kontakt os på 70 12 50 00')) {
      // This teaser contains the phone paragraph and intro to the list
      // Replace the phone number with a clickable link as in the source HTML
      let html = teaser.innerHTML;
      html = html.replace(
        /70 12 50 00/,
        '<a href="tel:+4570125000">70 12 50 00</a>'
      );
      phonePara = document.createElement('p');
      phonePara.innerHTML = html;
    } else if (teaser.textContent.trim()) {
      // Other non-empty teaser blocks as paragraphs
      const p = document.createElement('p');
      p.innerHTML = teaser.innerHTML;
      leftCellContent.push(p);
    }
  });
  // Insert phone paragraph before the list, matching original order
  if (phonePara) {
    leftCellContent.push(phonePara);
  }
  if (listBlock) {
    leftCellContent.push(listBlock);
  }

  // RIGHT COLUMN: video embed + caption
  const rightCol = columns[1];
  const rightTeaser = rightCol.querySelector('.teasers__teaser');
  let videoLink = null;
  let caption = null;
  if (rightTeaser) {
    const iframe = rightTeaser.querySelector('iframe');
    if (iframe) {
      videoLink = document.createElement('a');
      videoLink.href = iframe.src;
      videoLink.target = '_blank';
      videoLink.textContent = 'Se video';
    }
    caption = rightTeaser.querySelector('em');
  }
  const rightCellContent = [];
  if (videoLink) rightCellContent.push(videoLink);
  if (caption) rightCellContent.push(caption.cloneNode(true));

  const cells = [
    headerRow,
    [leftCellContent, rightCellContent]
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
