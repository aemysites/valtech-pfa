/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get the background image URL from style attribute
  function getBackgroundImageUrl(style) {
    if (!style) return null;
    const desktopMatch = style.match(/--imageDesktop:\s*url\(['"]?([^'")]+)['"]?\)/);
    if (desktopMatch) return desktopMatch[1];
    const mobileMatch = style.match(/--imageMobile:\s*url\(['"]?([^'")]+)['"]?\)/);
    if (mobileMatch) return mobileMatch[1];
    return null;
  }

  // Find desktop panel (for image)
  const desktopPanel = element.querySelector('.narrow-hero__panel--desktop');
  let imageUrl = null;
  if (desktopPanel) {
    const panelImageDiv = desktopPanel.querySelector('.panel__image');
    if (panelImageDiv) {
      imageUrl = getBackgroundImageUrl(panelImageDiv.getAttribute('style'));
    }
  }

  // Create image element if imageUrl found
  let imageEl = null;
  if (imageUrl) {
    imageEl = document.createElement('img');
    imageEl.src = imageUrl;
    imageEl.alt = '';
  }

  // Find panel__body (text, CTA) - use desktop version for consistency
  let panelBody = null;
  if (desktopPanel) {
    panelBody = desktopPanel.querySelector('.panel__body');
  }
  if (!panelBody) {
    const mobilePanel = element.querySelector('.narrow-hero__panel--mobile');
    if (mobilePanel) {
      panelBody = mobilePanel.querySelector('.panel__body');
    }
  }

  // Extract ALL text content from panelBody, not just specific selectors
  let contentCell = '';
  if (panelBody) {
    // Instead of picking only certain selectors, include all block-level children
    const fragments = [];
    Array.from(panelBody.childNodes).forEach((node) => {
      // Only include element nodes and non-empty text nodes
      if (node.nodeType === 1) {
        // For CTA, convert span.cta-btn to a link if possible
        if (node.classList.contains('cta-btn')) {
          let linkHref = '';
          let linkTarget = '';
          // Try to get href/target from closest ancestor anchor
          const anchor = panelBody.closest('a') || desktopPanel;
          if (anchor && anchor.tagName === 'A') {
            linkHref = anchor.getAttribute('href');
            linkTarget = anchor.getAttribute('target');
          }
          const a = document.createElement('a');
          if (linkHref) a.href = linkHref;
          if (linkTarget) a.target = linkTarget;
          Array.from(node.childNodes).forEach(child => a.appendChild(child.cloneNode(true)));
          fragments.push(a);
        } else {
          fragments.push(node.cloneNode(true));
        }
      } else if (node.nodeType === 3 && node.textContent.trim()) {
        // Non-empty text node
        fragments.push(document.createTextNode(node.textContent));
      }
    });
    contentCell = fragments;
  }

  const headerRow = ['Hero (hero51)'];
  const imageRow = [imageEl ? imageEl : ''];
  const contentRow = [contentCell];

  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  element.replaceWith(block);
}
