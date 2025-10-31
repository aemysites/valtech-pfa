/* global WebImporter */
export default function parse(element, { document }) {
  // Helper for cards with image
  function extractCard(panel) {
    let img = panel.querySelector('.panel__image img');
    let imageCell = img ? img : '';
    const body = panel.querySelector('.panel__body');
    let textFragments = [];
    if (body) {
      const kicker = body.querySelector('.panel__kicker');
      if (kicker) textFragments.push(kicker);
      const headline = body.querySelector('.panel__headline');
      if (headline) textFragments.push(headline);
      body.querySelectorAll('p:not(.panel__kicker)').forEach(p => {
        if (!headline || p !== headline) textFragments.push(p);
      });
      const cta = body.querySelector('.cta-btn');
      if (cta) textFragments.push(cta);
    }
    if (panel.tagName === 'A') {
      const link = document.createElement('a');
      link.href = panel.href;
      textFragments.forEach(frag => link.appendChild(frag.cloneNode(true)));
      return [imageCell, link];
    }
    return [imageCell, textFragments];
  }

  // Helper for news card (no image)
  function extractNews(panel) {
    const body = panel.querySelector('.panel__body');
    let textFragments = [];
    if (body) {
      const headline = body.querySelector('.panel__headline');
      if (headline) textFragments.push(headline);
      const newsList = body.querySelector('.panel__news-list');
      if (newsList) textFragments.push(newsList);
      const tags = body.querySelector('.panel__tags');
      if (tags) textFragments.push(tags);
    }
    return ['', textFragments];
  }

  // Helper for links card (no image)
  function extractLinks(panel) {
    const body = panel.querySelector('.panel__body');
    let textFragments = [];
    if (body) {
      const kicker = body.querySelector('.panel__kicker');
      if (kicker) textFragments.push(kicker);
      const list = body.querySelector('.panel__list');
      if (list) textFragments.push(list);
    }
    return ['', textFragments];
  }

  // Helper for new investment profiles card (no image, but must preserve link)
  function extractNewInvest(panel) {
    const body = panel.querySelector('.panel__body');
    let textFragments = [];
    if (body) {
      const headline = body.querySelector('.panel__headline');
      if (headline) textFragments.push(headline);
      const cta = body.querySelector('.cta-btn');
      if (cta) textFragments.push(cta);
    }
    // preserve the link wrapper
    if (panel.tagName === 'A') {
      const link = document.createElement('a');
      link.href = panel.href;
      textFragments.forEach(frag => link.appendChild(frag.cloneNode(true)));
      return ['', link];
    }
    return ['', textFragments];
  }

  const cards = [];
  const heroPanel = element.querySelector('.narrow-hero__panel--desktop');
  if (heroPanel) {
    cards.push(extractCard(heroPanel));
  }
  const podcastPanel = element.querySelector('a[href*="podcast"].panel--image');
  if (podcastPanel) {
    cards.push(extractCard(podcastPanel));
  }
  const seniorPanel = element.querySelector('a[href*="det-gode-seniorliv-hub"].panel--image');
  if (seniorPanel) {
    cards.push(extractCard(seniorPanel));
  }
  const newsPanel = element.querySelector('.panel--news');
  if (newsPanel) {
    cards.push(extractNews(newsPanel));
  }
  const investPanel = element.querySelector('a[href*="klogere-paa-investeringer"].panel--image');
  if (investPanel) {
    cards.push(extractCard(investPanel));
  }
  const linksPanel = element.querySelector('.panel--shortcuts-secondary');
  if (linksPanel) {
    cards.push(extractLinks(linksPanel));
  }
  const newInvestPanel = element.querySelector('a.panel--green');
  if (newInvestPanel) {
    cards.push(extractNewInvest(newInvestPanel));
  }

  const rows = [['Cards (cards7)']];
  cards.forEach(card => rows.push(card));

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
