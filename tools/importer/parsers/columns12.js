/* global WebImporter */
export default function parse(element, { document }) {
  const rows = Array.from(element.querySelectorAll(':scope > div > div.row.panels > div'));

  // --- HERO SECTION ---
  const heroPanel = rows.find(r => r.classList.contains('narrow-hero'));
  let heroContent;
  if (heroPanel) {
    // Desktop hero
    const desktopLink = heroPanel.querySelector('.narrow-hero__panel--desktop');
    if (desktopLink) {
      const heroImgDiv = desktopLink.querySelector('.panel__image');
      const heroImg = heroImgDiv && heroImgDiv.querySelector('img');
      const heroBody = desktopLink.querySelector('.panel__body');
      heroContent = document.createElement('div');
      if (heroImg) heroContent.appendChild(heroImg);
      if (heroBody) {
        // Fix: preserve anchor for CTA if present
        const ctaBtn = heroBody.querySelector('.cta-btn');
        if (ctaBtn) {
          const parentLink = desktopLink;
          if (parentLink && parentLink.tagName === 'A' && parentLink.getAttribute('href')) {
            const anchor = document.createElement('a');
            anchor.href = parentLink.getAttribute('href');
            anchor.innerHTML = ctaBtn.innerHTML;
            ctaBtn.replaceWith(anchor);
          }
        }
        heroContent.appendChild(heroBody);
      }
    }
  }

  // --- THREE COLUMNS BELOW HERO ---
  // 1. Årsrapporter card (image + label)
  const cardPanel = rows.find(r => r.querySelector('.panel--imagespot-green'));
  let cardContent;
  if (cardPanel) {
    const cardLink = cardPanel.querySelector('a.panel--imagespot-green');
    if (cardLink) {
      cardContent = document.createElement('div');
      const cardImgDiv = cardLink.querySelector('.panel__image');
      const cardImg = cardImgDiv && cardImgDiv.querySelector('img');
      if (cardImg) cardContent.appendChild(cardImg);
      const spotText = cardLink.querySelector('.panel__spot-text');
      if (spotText) cardContent.appendChild(spotText);
    }
  }

  // 2. Kontakt panel (red background, headline, CTA)
  const kontaktPanel = rows.find(r => r.querySelector('.panel--primary'));
  let kontaktContent;
  if (kontaktPanel) {
    const kontaktLink = kontaktPanel.querySelector('a.panel--primary');
    if (kontaktLink) {
      kontaktContent = kontaktLink.querySelector('.panel__body');
    }
  }

  // 3. News panel (headline, list, link)
  const newsPanel = rows.find(r => r.querySelector('.panel--news'));
  let newsContent;
  if (newsPanel) {
    const newsBody = newsPanel.querySelector('.panel__body');
    if (newsBody) newsContent = newsBody;
  }

  // --- TABLE CONSTRUCTION ---
  const headerRow = ['Columns (columns12)'];
  const heroRow = [heroContent];
  const columnsRow = [cardContent, kontaktContent, newsContent];
  const cells = [headerRow, heroRow, columnsRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
