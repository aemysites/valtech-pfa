/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card content, including all text and visual cues
  function extractCard(cardEl) {
    let img = cardEl.querySelector('.panel__image img');
    let imgCell = '';
    const panelClasses = cardEl.className;
    if (!img) {
      const bgDiv = cardEl.querySelector('.panel__image');
      if (bgDiv && bgDiv.dataset.hlxBackgroundImage) {
        const urlMatch = bgDiv.dataset.hlxBackgroundImage.match(/url\(("|')?(.*?)\1?\)/);
        if (urlMatch && urlMatch[2]) {
          img = document.createElement('img');
          img.src = urlMatch[2];
          imgCell = img;
        }
      }
      // If no image but colored card, add a color swatch with kicker text
      if (!imgCell && /panel--primary/.test(panelClasses)) {
        const swatch = document.createElement('div');
        const kicker = cardEl.querySelector('.panel__kicker');
        swatch.textContent = kicker ? kicker.textContent : '';
        swatch.style.background = '#a6001a';
        swatch.style.color = '#fff';
        swatch.style.padding = '8px';
        swatch.style.borderRadius = '4px';
        imgCell = swatch;
      } else if (!imgCell && /panel--green/.test(panelClasses)) {
        const swatch = document.createElement('div');
        const kicker = cardEl.querySelector('.panel__kicker');
        swatch.textContent = kicker ? kicker.textContent : '';
        swatch.style.background = '#006d6a';
        swatch.style.color = '#fff';
        swatch.style.padding = '8px';
        swatch.style.borderRadius = '4px';
        imgCell = swatch;
      } else if (!imgCell && /panel--tertiary/.test(panelClasses)) {
        const swatch = document.createElement('div');
        const kicker = cardEl.querySelector('.panel__kicker');
        swatch.textContent = kicker ? kicker.textContent : '';
        swatch.style.background = '#fff';
        swatch.style.color = '#a6001a';
        swatch.style.border = '1px solid #ccc';
        swatch.style.padding = '8px';
        swatch.style.borderRadius = '4px';
        imgCell = swatch;
      }
    } else {
      imgCell = img;
    }
    // Collect all text content
    const body = cardEl.querySelector('.panel__body');
    const fragments = [];
    if (body) {
      Array.from(body.childNodes).forEach((node) => {
        if ((node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim()))) {
          fragments.push(node);
        }
      });
      // If there's a news list, keep its structure
      const newsList = body.querySelector('.panel__news-list');
      if (newsList) {
        const ul = document.createElement('ul');
        newsList.querySelectorAll('li').forEach((li) => {
          ul.appendChild(li.cloneNode(true));
        });
        fragments.push(ul);
      }
    }
    // If no body, fallback to all children
    if (!body) {
      Array.from(cardEl.childNodes).forEach((node) => {
        if ((node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim()))) {
          fragments.push(node);
        }
      });
    }
    return [imgCell, fragments.length ? fragments : ''];
  }

  // Hero card (include all text content and image, ensure CTA is a link if present)
  const heroDesktop = element.querySelector('.narrow-hero__panel--desktop');
  let heroCard = null;
  if (heroDesktop) {
    let img = heroDesktop.querySelector('.panel__image img');
    if (!img) {
      const bgDiv = heroDesktop.querySelector('.panel__image');
      if (bgDiv && bgDiv.dataset.hlxBackgroundImage) {
        const urlMatch = bgDiv.dataset.hlxBackgroundImage.match(/url\(("|')?(.*?)\1?\)/);
        if (urlMatch && urlMatch[2]) {
          img = document.createElement('img');
          img.src = urlMatch[2];
        }
      }
    }
    const body = heroDesktop.querySelector('.panel__body');
    const fragments = [];
    if (body) {
      Array.from(body.childNodes).forEach((node) => {
        if ((node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim()))) {
          // Replace CTA span with a link if possible
          if (node.classList && node.classList.contains('cta-btn')) {
            const link = document.createElement('a');
            link.textContent = node.textContent.trim();
            link.href = heroDesktop.getAttribute('href') || '#';
            fragments.push(link);
          } else {
            fragments.push(node);
          }
        }
      });
    }
    heroCard = [img ? img : '', fragments.length ? fragments : ''];
  }

  const cards = [];
  if (heroCard) cards.push(heroCard);
  // Senior card
  const seniorCard = element.querySelector('a.panel--primary');
  if (seniorCard) {
    cards.push(extractCard(seniorCard));
  }
  // Firmapension card
  const firmapensionCard = element.querySelector('a.panel--image[href*="bliv-kunde"]');
  if (firmapensionCard) {
    cards.push(extractCard(firmapensionCard));
  }
  // News card
  const newsPanel = element.querySelector('.panel--news');
  if (newsPanel) {
    cards.push(extractCard(newsPanel));
  }
  // Investment profiles card
  const investProfileCard = element.querySelector('a.panel--image[href*="nye-investeringsprofiler-btb"]');
  if (investProfileCard) {
    cards.push(extractCard(investProfileCard));
  }
  // Green partner card
  const partnerCard = element.querySelector('a.panel--green');
  if (partnerCard) {
    cards.push(extractCard(partnerCard));
  }
  // Admin card
  const adminCard = element.querySelector('a.panel--tertiary');
  if (adminCard) {
    cards.push(extractCard(adminCard));
  }

  const headerRow = ['Cards (cards1)'];
  const tableRows = [headerRow, ...cards];
  const blockTable = WebImporter.DOMUtils.createTable(tableRows, document);
  element.replaceWith(blockTable);
}
