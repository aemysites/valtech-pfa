/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main panels row
  const panelsRow = element.querySelector('.row.panels');
  if (!panelsRow) return;
  const cols = Array.from(panelsRow.querySelectorAll(':scope > div'));

  // --- HERO SECTION ---
  const heroCol = cols.find(col => col.classList.contains('narrow-hero'));
  let heroPanel = null;
  if (heroCol) {
    heroPanel = heroCol.querySelector('.narrow-hero__panel--desktop') || heroCol.querySelector('.panel--hero');
  }
  let heroCell = '';
  if (heroPanel) {
    const imgDiv = heroPanel.querySelector('.panel__image');
    const heroImage = imgDiv ? imgDiv.querySelector('img') : null;
    const bodyDiv = heroPanel.querySelector('.panel__body');
    if (heroImage || bodyDiv) {
      const heroDiv = document.createElement('div');
      if (heroImage) heroDiv.appendChild(heroImage.cloneNode(true));
      if (bodyDiv) {
        const kicker = bodyDiv.querySelector('.panel__kicker');
        if (kicker) heroDiv.appendChild(kicker.cloneNode(true));
        const headline = bodyDiv.querySelector('.panel__headline');
        if (headline) heroDiv.appendChild(headline.cloneNode(true));
        const cta = bodyDiv.querySelector('.cta-btn');
        if (cta) heroDiv.appendChild(cta.cloneNode(true));
      }
      heroCell = heroDiv;
    }
  }

  // --- THREE COLUMNS BELOW HERO ---
  const bottomCols = cols.filter(col => col.classList.contains('col-md-4'));

  // 1. Årsrapporter (image spot)
  let spotCell = '';
  if (bottomCols[0]) {
    const spotPanel = bottomCols[0].querySelector('.panel--imagespot');
    if (spotPanel) {
      const spotImageDiv = spotPanel.querySelector('.panel__image');
      const spotImage = spotImageDiv ? spotImageDiv.querySelector('img') : null;
      const spotTextDiv = spotPanel.querySelector('.panel__spot-text');
      const cellDiv = document.createElement('div');
      if (spotImage) cellDiv.appendChild(spotImage.cloneNode(true));
      if (spotTextDiv) cellDiv.appendChild(spotTextDiv.cloneNode(true));
      spotCell = cellDiv;
    }
  }

  // 2. Kontakt center (red card)
  let kontaktCell = '';
  if (bottomCols[1]) {
    const kontaktPanel = bottomCols[1].querySelector('.panel--primary');
    if (kontaktPanel) {
      const kontaktBody = kontaktPanel.querySelector('.panel__body');
      if (kontaktBody) {
        kontaktCell = kontaktBody.cloneNode(true);
      }
    }
  }

  // 3. Nyheder (news list)
  let newsCell = '';
  if (bottomCols[2]) {
    const newsPanel = bottomCols[2].querySelector('.panel--news');
    if (newsPanel) {
      const newsBody = newsPanel.querySelector('.panel__body');
      if (newsBody) {
        // Ensure all news items are included, even if some are hidden or not in <li>
        const newsList = newsBody.querySelector('.panel__news-list');
        if (newsList) {
          // Collect all <li> items
          const items = Array.from(newsList.querySelectorAll('li'));
          // Check for extra headlines not in <li>
          const extraHeadline = newsBody.querySelector('.panel__headline.panel__kicker--underlined.hide-for-desktop');
          if (extraHeadline && extraHeadline.textContent.trim()) {
            const exists = items.some(li => li.textContent.includes(extraHeadline.textContent.trim()));
            if (!exists) {
              const li = document.createElement('li');
              li.textContent = extraHeadline.textContent.trim();
              newsList.insertBefore(li, newsList.firstChild);
            }
          }
          // Check for time/date and news headline not wrapped in <li>
          // Find all <a> inside newsList
          const allAnchors = Array.from(newsList.querySelectorAll('a'));
          allAnchors.forEach(a => {
            // If parent is not <li>, wrap in <li>
            if (a.parentElement !== newsList) return;
            const li = document.createElement('li');
            li.appendChild(a.cloneNode(true));
            newsList.replaceChild(li, a);
          });
        }
        newsCell = newsBody.cloneNode(true);
      }
    }
  }

  // Table header
  const headerRow = ['Columns (columns12)'];
  // Table rows: hero section, then the three columns
  const tableRows = [[heroCell], [spotCell, kontaktCell, newsCell]];

  // Create table
  const cells = [headerRow, ...tableRows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  // Replace element
  element.replaceWith(block);
}
