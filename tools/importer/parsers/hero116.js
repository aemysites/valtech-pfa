/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Extract background image URL from inline style
  function getBackgroundImageUrl(style) {
    if (!style) return null;
    const desktopMatch = style.match(/--imageDesktop:\s*url\(['"]?([^'")]+)['"]?\)/);
    if (desktopMatch && desktopMatch[1]) return desktopMatch[1];
    const mobileMatch = style.match(/--imageMobile:\s*url\(['"]?([^'")]+)['"]?\)/);
    if (mobileMatch && mobileMatch[1]) return mobileMatch[1];
    return null;
  }

  // Find the desktop hero panel (for image)
  const desktopHeroPanel = element.querySelector('.narrow-hero__panel--desktop');
  let imageUrl = null;
  if (desktopHeroPanel) {
    const imageDiv = desktopHeroPanel.querySelector('.panel__image');
    if (imageDiv) {
      imageUrl = getBackgroundImageUrl(imageDiv.getAttribute('style'));
    }
  }

  // Create image element if imageUrl found
  let imageEl = null;
  if (imageUrl) {
    imageEl = document.createElement('img');
    imageEl.src = imageUrl;
    imageEl.alt = '';
  }

  // Find the hero headline (use desktop panel first, fallback to mobile)
  let headlineText = '';
  if (desktopHeroPanel) {
    const headline = desktopHeroPanel.querySelector('.panel__headline');
    if (headline) {
      headlineText = headline.textContent.trim();
    }
  }
  if (!headlineText) {
    const mobileHeroPanel = element.querySelector('.narrow-hero__panel--mobile');
    if (mobileHeroPanel) {
      const headline = mobileHeroPanel.querySelector('.panel__headline');
      if (headline) {
        headlineText = headline.textContent.trim();
      }
    }
  }

  // Compose the table rows
  const headerRow = ['Hero (hero116)'];
  const imageRow = [imageEl ? imageEl : ''];

  // Compose content cell
  let contentCell = [];
  if (headlineText) {
    const h1 = document.createElement('h1');
    h1.textContent = headlineText;
    contentCell.push(h1);
  }

  // Find the iframe and convert to a link (if present)
  const iframe = element.querySelector('iframe[src]');
  if (iframe) {
    const link = document.createElement('a');
    link.href = iframe.src;
    link.textContent = iframe.src;
    contentCell.push(document.createElement('br'));
    contentCell.push(link);
  }

  // Compose content row
  const contentRow = [contentCell.length > 1 ? contentCell : contentCell[0] || ''];

  // Build the table
  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
