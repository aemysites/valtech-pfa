/* global WebImporter */
export default function parse(element, { document }) {
  // Get immediate child columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));
  if (columns.length < 2) return;

  // --- LEFT COLUMN (video embed) ---
  const leftCol = columns[0];
  // Find the iframe (video player)
  const iframe = leftCol.querySelector('iframe[src]');
  let leftContent;
  if (iframe) {
    // Replace iframe with a link to its src
    const link = document.createElement('a');
    link.href = iframe.src;
    link.textContent = iframe.src;
    leftContent = link;
  } else {
    // Fallback: include all content from leftCol
    leftContent = leftCol.cloneNode(true);
  }

  // --- RIGHT COLUMN (cleaned text content, no duplicates) ---
  const rightCol = columns[1];
  const fragment = document.createDocumentFragment();

  // Extract heading (h3)
  const h3 = rightCol.querySelector('h3');
  if (h3) fragment.appendChild(h3.cloneNode(true));

  // Extract main description (first span after h3)
  const spans = Array.from(rightCol.querySelectorAll('span'));
  if (spans.length > 0) {
    // Find the first span after h3 that is not empty and not part of the heading
    for (let i = 0; i < spans.length; i++) {
      const span = spans[i];
      // Only add if not inside h3
      if (!h3 || !h3.contains(span)) {
        if (span.textContent.trim()) {
          const p = document.createElement('p');
          p.textContent = span.textContent.trim();
          fragment.appendChild(p);
          break; // Only the first description span
        }
      }
    }
  }

  // Extract instruction (p.teasers__teaser)
  const pTeaser = rightCol.querySelector('p.teasers__teaser');
  if (pTeaser) {
    // Only add if not already present
    const text = pTeaser.textContent.trim();
    let alreadyPresent = false;
    fragment.childNodes.forEach(node => {
      if (node.textContent && node.textContent.trim() === text) {
        alreadyPresent = true;
      }
    });
    if (!alreadyPresent) fragment.appendChild(pTeaser.cloneNode(true));
  }

  // If nothing found, fallback to all text
  let rightContent;
  if (fragment.childNodes.length) {
    rightContent = fragment;
  } else {
    rightContent = document.createElement('div');
    rightContent.textContent = rightCol.textContent.trim();
  }

  // --- TABLE ---
  const headerRow = ['Columns (columns91)'];
  const contentRow = [leftContent, rightContent];
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);
  element.replaceWith(table);
}
