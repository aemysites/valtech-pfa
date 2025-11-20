/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the Columns block
  const headerRow = ['Columns (columns82)'];

  // Get immediate child columns (two columns expected)
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  if (columns.length < 2) return;

  // --- Left Column: Text + CTA ---
  const leftCol = columns[0];
  const leftContent = [];
  let buffer = '';
  leftCol.childNodes.forEach((node) => {
    // Only include <h5> if it has content
    if (node.nodeType === 1 && node.tagName === 'H5' && node.textContent.trim()) {
      leftContent.push(node.cloneNode(true));
      return;
    }
    if (node.nodeType === 1 && node.classList.contains('col-xs-12') && node.classList.contains('text-center')) {
      if (buffer.trim()) {
        const p = document.createElement('p');
        p.textContent = buffer.trim();
        leftContent.push(p);
        buffer = '';
      }
      const cta = node.querySelector('a.cta-btn');
      if (cta) leftContent.push(cta.cloneNode(true));
    } else if (node.nodeType === 3) {
      buffer += node.textContent;
    } else if (node.nodeType === 1 && node.tagName !== 'DIV') {
      if (buffer.trim()) {
        const p = document.createElement('p');
        p.textContent = buffer.trim();
        leftContent.push(p);
        buffer = '';
      }
      leftContent.push(node.cloneNode(true));
    }
  });
  if (buffer.trim()) {
    const p = document.createElement('p');
    p.textContent = buffer.trim();
    leftContent.push(p);
  }

  // --- Right Column: Heading + Video Embed + Caption (if present in HTML) ---
  const rightCol = columns[1];
  const rightContent = [];
  const teaser = rightCol.querySelector('.teasers__teaser') || rightCol;
  const heading = teaser.querySelector('h5');
  if (heading) rightContent.push(heading.cloneNode(true));
  const videoWrapper = teaser.querySelector('div[style*="padding-bottom"]');
  if (videoWrapper) {
    const iframe = videoWrapper.querySelector('iframe');
    if (iframe) {
      // Convert iframe to a link
      const videoLink = document.createElement('a');
      videoLink.href = iframe.src;
      videoLink.textContent = 'Se video';
      rightContent.push(videoLink);
    }
    // Extract caption/subtitle if present in HTML
    const caption = videoWrapper.querySelector('p, span, div');
    if (caption && caption.textContent.trim()) {
      const captionElem = document.createElement('p');
      captionElem.textContent = caption.textContent.trim();
      rightContent.push(captionElem);
    }
  }

  const cells = [
    headerRow,
    [leftContent, rightContent]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
