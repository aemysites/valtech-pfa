/* global WebImporter */
export default function parse(element, { document }) {
  // Always start with the required header row
  const headerRow = ['Columns (columns6)'];

  // Find the two columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  const leftCol = columns[0] || element;
  const rightCol = columns[1] || null;

  // LEFT COLUMN: Collect all block-level elements for full text coverage
  let leftContent = [];
  if (leftCol) {
    const teaser = leftCol.querySelector('.teasers__teaser');
    if (teaser) {
      // Collect all paragraphs, links, and lists
      Array.from(teaser.childNodes).forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.tagName === 'P' || node.tagName === 'UL') {
            leftContent.push(node.cloneNode(true));
          } else if (node.tagName === 'A') {
            // Inline links outside paragraphs
            const span = document.createElement('span');
            span.appendChild(node.cloneNode(true));
            leftContent.push(span);
          }
        } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
          // Text nodes outside paragraphs
          const p = document.createElement('p');
          p.textContent = node.textContent.trim();
          leftContent.push(p);
        }
      });
    }
  }

  // RIGHT COLUMN: Video and caption
  let rightContent = [];
  if (rightCol) {
    const teaser = rightCol.querySelector('.teasers__teaser');
    if (teaser) {
      // Video embed
      const videoWrapper = teaser.querySelector('div[style*="padding-bottom"]');
      if (videoWrapper) {
        const iframe = videoWrapper.querySelector('iframe');
        if (iframe && iframe.src) {
          // Create a video link with play button overlay
          const videoLink = document.createElement('a');
          videoLink.href = iframe.src;
          videoLink.style.display = 'inline-block';
          videoLink.style.position = 'relative';
          videoLink.style.width = '200px';
          videoLink.style.height = '112px';
          videoLink.style.background = '#222';
          videoLink.style.borderRadius = '8px';
          videoLink.style.textAlign = 'center';
          // Play button SVG
          const playBtn = document.createElement('span');
          playBtn.innerHTML = '<svg width="60" height="60" viewBox="0 0 60 60" style="position:absolute;top:26px;left:70px;"><circle cx="30" cy="30" r="30" fill="rgba(255,255,255,0.7)"/><polygon points="24,20 44,30 24,40" fill="#d00"/></svg>';
          playBtn.style.position = 'absolute';
          playBtn.style.top = '0';
          playBtn.style.left = '0';
          playBtn.style.width = '100%';
          playBtn.style.height = '100%';
          videoLink.appendChild(playBtn);
          rightContent.push(videoLink);
        }
      }
      // Caption
      const caption = teaser.querySelector('em');
      if (caption) {
        rightContent.push(caption.cloneNode(true));
      }
    }
  }

  // Build the table rows
  const tableRows = [
    headerRow,
    [leftContent, rightContent]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
