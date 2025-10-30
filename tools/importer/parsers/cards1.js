/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card content, preserving links and mandatory image/icon cell
  function extractCardContent(card, col) {
    // Find the wrapping anchor if present
    let link = card.closest('a[href]') || card.querySelector('a[href]');
    // Image (if present)
    let img = card.querySelector('.panel__image img');
    let imageCell = '';
    if (img) {
      imageCell = img.cloneNode(true);
    } else {
      // If no image, use a colored block as a visual placeholder
      let color = '';
      if (card.classList.contains('panel--primary')) color = '#a60a1c';
      else if (card.classList.contains('panel--green')) color = '#006e6a';
      else if (card.classList.contains('panel--tertiary')) color = '#eaeaea';
      if (color) {
        const colorDiv = document.createElement('div');
        colorDiv.style.width = '100%';
        colorDiv.style.height = '40px';
        colorDiv.style.background = color;
        colorDiv.setAttribute('aria-label', 'color');
        imageCell = colorDiv;
      }
    }
    // Body content
    const body = card.querySelector('.panel__body');
    let bodyElements = [];
    if (body) {
      const kicker = body.querySelector('.panel__kicker');
      if (kicker) bodyElements.push(kicker.cloneNode(true));
      const headline = body.querySelector('.panel__headline');
      if (headline) {
        // Only add headline once (avoid duplicate <p> inside <h2>)
        if (headline.childElementCount === 1 && headline.firstElementChild.tagName === 'P') {
          bodyElements.push(headline.firstElementChild.cloneNode(true));
        } else {
          bodyElements.push(headline.cloneNode(true));
        }
      }
      const cta = body.querySelector('.cta-btn');
      if (cta) bodyElements.push(cta.cloneNode(true));
    }
    if (bodyElements.length === 0 && body) {
      bodyElements = Array.from(body.children).map((el) => el.cloneNode(true));
    }
    if (!body) {
      bodyElements = Array.from(card.children).map((el) => el.cloneNode(true));
    }
    // Wrap text cell with link if present
    let textCell = bodyElements;
    if (link && link.getAttribute('href')) {
      const wrapper = document.createElement('a');
      wrapper.href = link.getAttribute('href');
      if (link.hasAttribute('target')) {
        wrapper.setAttribute('target', link.getAttribute('target'));
      }
      bodyElements.forEach((el) => wrapper.appendChild(el));
      textCell = [wrapper];
    }
    return [imageCell, textCell];
  }

  // Helper for news card
  function extractNewsCard(card) {
    const body = card.querySelector('.panel__body');
    let bodyElements = [];
    if (body) {
      const headline = body.querySelector('.panel__headline');
      if (headline) bodyElements.push(headline.cloneNode(true));
      const newsList = body.querySelector('.panel__news-list');
      if (newsList) bodyElements.push(newsList.cloneNode(true));
      const tags = body.querySelector('.panel__tags');
      if (tags) bodyElements.push(tags.cloneNode(true));
    }
    // Use white color block for news card
    const colorDiv = document.createElement('div');
    colorDiv.style.width = '100%';
    colorDiv.style.height = '40px';
    colorDiv.style.background = '#fff';
    colorDiv.setAttribute('aria-label', 'color');
    return [colorDiv, bodyElements];
  }

  // Find all card columns (excluding empty ones)
  const cardColumns = Array.from(element.querySelectorAll('.row.panels > .col-sm-6, .row.panels > .col-md-4, .row.panels > .col-sm-4, .row.panels > .col-sm-8'));
  // Special handling for hero card (first child)
  const heroCol = element.querySelector('.narrow-hero');
  let heroCard;
  if (heroCol) {
    heroCard = heroCol.querySelector('.narrow-hero__panel--desktop') || heroCol.querySelector('.narrow-hero__panel--mobile');
  }
  // News card detection
  const newsCard = element.querySelector('.panel--news');
  // Build rows
  const rows = [];
  rows.push(['Cards (cards1)']);
  // Hero card (if present)
  if (heroCard) {
    rows.push(extractCardContent(heroCard, heroCol));
  }
  // Iterate over card columns
  cardColumns.forEach((col) => {
    const panel = col.querySelector('.panel');
    if (!panel) return;
    if (panel.classList.contains('panel--hero') || panel.classList.contains('panel--news')) return;
    rows.push(extractCardContent(panel, col));
  });
  // News card (if present)
  if (newsCard) {
    rows.push(extractNewsCard(newsCard));
  }
  // Replace element with block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
