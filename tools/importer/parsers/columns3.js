/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns3)'];

  // Get immediate column divs
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  // There should be 2 columns for this block
  const leftCol = columns[0];
  const rightCol = columns[1];

  // Helper: extract all text content and elements from a column, including images and their alt text
  function extractColumnContent(col) {
    if (!col) return '';
    const teaser = col.querySelector('.teasers__teaser');
    if (teaser) {
      // Collect all images and their alt text
      const imgs = Array.from(teaser.querySelectorAll('img'));
      const imgContent = imgs.map(img => {
        // If alt text is present and non-empty, include it as a paragraph
        if (img.alt && img.alt.trim()) {
          const p = document.createElement('p');
          p.textContent = img.alt.trim();
          return [img, p];
        }
        return img;
      });
      // Collect all text nodes in teaser
      const textNodes = Array.from(teaser.childNodes).filter(node => node.nodeType === 3 && node.textContent.trim());
      const textContent = textNodes.map(node => {
        const span = document.createElement('span');
        span.textContent = node.textContent.trim();
        return span;
      });
      // Collect all other elements except images
      const otherContent = Array.from(teaser.children).filter(el => el.tagName !== 'IMG');
      // Flatten and combine all content
      return [].concat(...imgContent, ...textContent, ...otherContent);
    }
    return '';
  }

  // Helper: extract all text content from the column (including nested elements)
  function extractAllText(col) {
    if (!col) return '';
    const teaser = col.querySelector('.teasers__teaser');
    if (teaser) {
      let text = '';
      // Get all text from teaser and its descendants
      teaser.querySelectorAll('*').forEach(el => {
        if (el.childNodes.length) {
          el.childNodes.forEach(node => {
            if (node.nodeType === 3 && node.textContent.trim()) {
              text += node.textContent.trim() + '\n';
            }
          });
        }
      });
      // Also get direct text nodes
      Array.from(teaser.childNodes).forEach(node => {
        if (node.nodeType === 3 && node.textContent.trim()) {
          text += node.textContent.trim() + '\n';
        }
      });
      if (text.trim()) {
        const div = document.createElement('div');
        div.textContent = text.trim();
        return div;
      }
    }
    return '';
  }

  // Combine image and text content for each column
  const leftContent = [...extractColumnContent(leftCol), extractAllText(leftCol)].filter(Boolean);
  const rightContent = [...extractColumnContent(rightCol), extractAllText(rightCol)].filter(Boolean);

  // Build the table rows
  const cells = [
    headerRow,
    [leftContent, rightContent]
  ];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace the original element
  element.replaceWith(block);
}
