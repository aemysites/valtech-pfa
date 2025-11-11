/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: extract image if present, else create a colored block for cards with colored backgrounds
  function getImageOrColor(panel) {
    let img = panel.querySelector('.panel__image img');
    if (!img) {
      const imgWrap = panel.querySelector('.panel__image');
      if (imgWrap) {
        img = imgWrap.querySelector('img');
      }
    }
    if (img) return img;
    // If no image, check for colored background (panel--primary, panel--green, panel--tertiary, etc.)
    const classes = panel.className;
    let color = null;
    if (classes.includes('panel--primary')) color = '#a2001d'; // red
    else if (classes.includes('panel--green')) color = '#006d6d'; // teal
    else if (classes.includes('panel--tertiary')) color = '#fff'; // white
    // If color found, create a colored div as placeholder
    if (color) {
      const colorDiv = document.createElement('div');
      colorDiv.style.width = '60px';
      colorDiv.style.height = '60px';
      colorDiv.style.background = color;
      colorDiv.style.borderRadius = '8px';
      colorDiv.style.display = 'inline-block';
      colorDiv.setAttribute('title', 'Color block');
      return colorDiv;
    }
    // If no image or color, use a default icon for news card
    if (classes.includes('panel--news')) {
      // Use a Unicode news icon or create a simple SVG
      const newsIcon = document.createElement('span');
      newsIcon.textContent = '\uD83D\uDCF0'; // Newspaper emoji
      newsIcon.style.fontSize = '40px';
      newsIcon.style.display = 'inline-block';
      newsIcon.setAttribute('title', 'News');
      return newsIcon;
    }
    // Otherwise, return empty string
    return '';
  }

  // Helper: extract all text content from panel body, including links
  function getText(panel) {
    const body = panel.querySelector('.panel__body');
    let content = body ? body.cloneNode(true) : panel.cloneNode(true);
    // If the panel is an <a>, wrap content in an <a> with the href
    if (panel.tagName === 'A' && panel.href) {
      const a = document.createElement('a');
      a.href = panel.href;
      if (panel.target) a.target = panel.target;
      a.appendChild(content);
      return a;
    }
    return content;
  }

  // Find all cards: hero, 6 below
  const cards = [];

  // Hero card (desktop)
  const heroDesktop = element.querySelector('.narrow-hero__panel--desktop');
  if (heroDesktop) {
    cards.push([
      getImageOrColor(heroDesktop),
      getText(heroDesktop)
    ]);
  }

  // Card panels below hero
  // Select all direct .panel under .row.panels, skipping hero
  const panelCols = Array.from(element.querySelectorAll('.row.panels > .col-sm-6, .row.panels > .col-sm-4, .row.panels > .col-md-4'));
  panelCols.forEach(col => {
    const panel = col.querySelector('.panel');
    if (panel) {
      cards.push([
        getImageOrColor(panel),
        getText(panel)
      ]);
    }
  });

  // Also check for .panel--news (news card)
  const newsPanel = element.querySelector('.panel--news');
  if (newsPanel && !cards.some(([img, txt]) => txt.isEqualNode(newsPanel.querySelector('.panel__body')))) {
    cards.push([
      getImageOrColor(newsPanel),
      getText(newsPanel)
    ]);
  }

  // Header row
  const headerRow = ['Cards (cards1)'];
  const tableRows = [headerRow, ...cards];

  const block = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(block);
}
