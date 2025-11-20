/* global WebImporter */
export default function parse(element, { document }) {
  // Extract hero image (desktop or mobile)
  function getHeroImage() {
    const desktopPanel = element.querySelector('.narrow-hero__panel--desktop');
    const mobilePanel = element.querySelector('.narrow-hero__panel--mobile');
    let imgDiv = null;
    if (desktopPanel) {
      imgDiv = desktopPanel.querySelector('.panel__image');
    } else if (mobilePanel) {
      imgDiv = mobilePanel.querySelector('.panel__image');
    }
    if (imgDiv) {
      const style = imgDiv.getAttribute('style') || '';
      let urlMatch = style.match(/--imageDesktop:\s*url\(['"]?([^'")]+)['"]?\)/);
      if (!urlMatch) {
        urlMatch = style.match(/--imageMobile:\s*url\(['"]?([^'")]+)['"]?\)/);
      }
      if (urlMatch) {
        const img = document.createElement('img');
        img.src = urlMatch[1];
        img.alt = '';
        return img;
      }
    }
    return '';
  }

  // Extract hero text (kicker, headline) from desktop panel only (avoid duplication)
  function getHeroText() {
    const desktopPanel = element.querySelector('.narrow-hero__panel--desktop');
    const panelBody = desktopPanel ? desktopPanel.querySelector('.panel__body') : null;
    const content = [];
    if (panelBody) {
      const kicker = panelBody.querySelector('.panel__kicker');
      const headline = panelBody.querySelector('.panel__headline');
      if (kicker) content.push(kicker.textContent.trim());
      if (headline) {
        const h1 = document.createElement('h1');
        h1.textContent = headline.textContent.trim();
        content.push(h1);
      }
    }
    return content;
  }

  // Build table rows
  const headerRow = ['Hero (hero50)'];
  const imageRow = [getHeroImage()];
  const heroText = getHeroText();
  const thirdRow = [heroText.length ? heroText : ''];
  const cells = [headerRow, imageRow, thirdRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
