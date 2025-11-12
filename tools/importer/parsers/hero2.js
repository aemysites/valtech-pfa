/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image URL from style attribute
  function extractImageUrl(styleStr, key) {
    if (!styleStr) return null;
    const regex = new RegExp(`${key}\s*:\s*url\(['"]?([^'")]+)['"]?\)`);
    const match = styleStr.match(regex);
    return match ? match[1] : null;
  }

  // Find the desktop hero panel (prefer desktop for image)
  let imageUrl = null;
  const desktopPanel = element.querySelector('.panel--image.narrow-hero__panel--desktop');
  if (desktopPanel) {
    const imageDiv = desktopPanel.querySelector('.panel__image');
    if (imageDiv && imageDiv.getAttribute('style')) {
      imageUrl = extractImageUrl(imageDiv.getAttribute('style'), '--imageDesktop');
    }
  }

  // If no desktop image, fallback to mobile panel
  if (!imageUrl) {
    const mobilePanel = element.querySelector('.panel--image.narrow-hero__panel--mobile');
    if (mobilePanel) {
      const imageDiv = mobilePanel.querySelector('.panel__image');
      if (imageDiv && imageDiv.getAttribute('style')) {
        imageUrl = extractImageUrl(imageDiv.getAttribute('style'), '--imageMobile');
      }
    }
  }

  // Always include imageEl in the image row, even if not found
  let imageEl = '';
  if (imageUrl) {
    imageEl = document.createElement('img');
    imageEl.src = imageUrl;
    imageEl.alt = '';
  } else {
    imageEl = '';
  }

  // Prefer desktop panel body for text content
  let panelBody = null;
  if (desktopPanel) {
    panelBody = desktopPanel.querySelector('.panel__body');
  }
  // Fallback to mobile panel body
  if (!panelBody) {
    const mobilePanel = element.querySelector('.panel--hero.narrow-hero__panel--mobile');
    if (mobilePanel) {
      panelBody = mobilePanel.querySelector('.panel__body');
    }
  }

  // Extract all text content from the panel body, preserving structure
  let textContent = [];
  if (panelBody) {
    // Extract kicker (subheading)
    const kickerEl = panelBody.querySelector('.panel__kicker');
    if (kickerEl) {
      const kicker = document.createElement('p');
      kicker.textContent = kickerEl.textContent;
      textContent.push(kicker);
    }
    // Extract headline (title)
    const headlineEl = panelBody.querySelector('.panel__headline');
    if (headlineEl) {
      const heroSpan = headlineEl.querySelector('.hero');
      const h1 = document.createElement('h1');
      if (heroSpan) {
        h1.textContent = heroSpan.textContent;
      } else {
        h1.textContent = headlineEl.textContent;
      }
      textContent.push(h1);
    }
  }

  // Table rows
  const headerRow = ['Hero (hero2)'];
  const imageRow = [imageEl]; // Always include imageEl, even if empty string
  const textRow = [textContent.length ? textContent : ''];

  const cells = [headerRow, imageRow, textRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
