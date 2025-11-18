/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: extract background image URL from style attribute
  function getBackgroundImageUrl(panelImageDiv) {
    if (!panelImageDiv) return null;
    const style = panelImageDiv.getAttribute('style') || '';
    let match = style.match(/--imageDesktop:\s*url\(['"]?([^'")]+)['"]?\)/);
    if (!match) {
      match = style.match(/--imageMobile:\s*url\(['"]?([^'")]+)['"]?\)/);
    }
    return match ? match[1] : null;
  }

  // Find the hero panel (desktop preferred)
  const heroPanel = element.querySelector('.narrow-hero__panel--desktop') || element.querySelector('.narrow-hero__panel--mobile');
  let backgroundImageUrl = null;
  if (heroPanel) {
    const panelImageDiv = heroPanel.querySelector('.panel__image');
    backgroundImageUrl = getBackgroundImageUrl(panelImageDiv);
  }

  // Extract all text content from the hero panel (kicker and headline)
  let kicker = '', headline = '';
  if (heroPanel) {
    const panelBody = heroPanel.querySelector('.panel__body');
    if (panelBody) {
      // Less specific: get all text nodes in panelBody
      const textNodes = Array.from(panelBody.childNodes).filter(n => n.nodeType === Node.ELEMENT_NODE || n.nodeType === Node.TEXT_NODE);
      let contentText = '';
      textNodes.forEach(n => {
        if (n.nodeType === Node.ELEMENT_NODE) {
          contentText += n.textContent + '\n';
        } else if (n.nodeType === Node.TEXT_NODE) {
          contentText += n.textContent + '\n';
        }
      });
      // Try to split into kicker and headline
      const lines = contentText.split('\n').map(l => l.trim()).filter(l => l);
      if (lines.length > 0) kicker = lines[0];
      if (lines.length > 1) headline = lines.slice(1).join(' ');
    }
  }

  // Extract sticky CTA bar content (all text and button)
  const stickyCta = element.querySelector('.sticky-cta');
  let ctaHeading = '', ctaSubheading = '', ctaLinkText = '', ctaLinkHref = '';
  if (stickyCta) {
    const ctaText = stickyCta.querySelector('.sticky-cta__inner__text');
    if (ctaText) {
      ctaHeading = ctaText.querySelector('h5')?.textContent.trim() || '';
      ctaSubheading = ctaText.querySelector('p')?.textContent.trim() || '';
    }
    const ctaLink = stickyCta.querySelector('a.cta-btn');
    if (ctaLink) {
      ctaLinkText = ctaLink.textContent.trim();
      ctaLinkHref = ctaLink.getAttribute('href') || '';
    }
  }

  // Table header: block name
  const headerRow = ['Hero (hero40)'];

  // Table row 2: background image
  let backgroundImageRow;
  if (backgroundImageUrl) {
    const img = document.createElement('img');
    img.src = backgroundImageUrl;
    img.alt = '';
    backgroundImageRow = [img];
  } else {
    backgroundImageRow = [''];
  }

  // Table row 3: content (all hero text + sticky CTA bar content)
  const content = [];
  if (kicker) {
    const kickerP = document.createElement('p');
    kickerP.textContent = kicker;
    content.push(kickerP);
  }
  if (headline) {
    const headlineH1 = document.createElement('h1');
    headlineH1.textContent = headline;
    content.push(headlineH1);
  }
  // Add sticky CTA bar content if present
  if (ctaHeading) {
    const ctaHeadingEl = document.createElement('strong');
    ctaHeadingEl.textContent = ctaHeading;
    content.push(ctaHeadingEl);
  }
  if (ctaSubheading) {
    const ctaSubheadingEl = document.createElement('p');
    ctaSubheadingEl.textContent = ctaSubheading;
    content.push(ctaSubheadingEl);
  }
  if (ctaLinkText) {
    const ctaButton = document.createElement('a');
    ctaButton.href = ctaLinkHref;
    ctaButton.textContent = ctaLinkText;
    content.push(ctaButton);
  }

  const contentRow = [content];
  const tableRows = [headerRow, backgroundImageRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  element.replaceWith(table);
}
