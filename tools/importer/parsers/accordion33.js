/* global WebImporter */
export default function parse(element, { document }) {
  // Collect all content before the first accordion toggler
  const firstToggler = element.querySelector('p.accordions__toggler');
  const introNodes = [];
  let node = element.firstChild;
  while (node && node !== firstToggler) {
    if (node.nodeType === Node.ELEMENT_NODE && node.textContent.trim()) {
      introNodes.push(node.cloneNode(true));
    }
    node = node.nextSibling;
  }

  // Accordion items: <p class="accordions__toggler"> (title) followed by <div class="accordions__element"> (content)
  const togglers = Array.from(element.querySelectorAll('p.accordions__toggler'));
  const rows = [];

  // Add intro content as the first accordion item if present
  if (introNodes.length) {
    const introDiv = document.createElement('div');
    introNodes.forEach(n => introDiv.appendChild(n));
    // Use heading text as title if present, otherwise generic label
    let introTitle = '';
    for (const n of introNodes) {
      if (/^h[1-6]$/i.test(n.tagName)) {
        introTitle = n.textContent.trim();
        break;
      }
    }
    if (!introTitle) introTitle = 'Introduktion';
    rows.push([introTitle, introDiv]);
  }

  togglers.forEach((toggler) => {
    let content = toggler.nextElementSibling;
    while (content && !(content.classList.contains('accordions__element') || content.classList.contains('accordion__element'))) {
      content = content.nextElementSibling;
    }
    if (toggler.textContent.trim() && content) {
      const contentDiv = document.createElement('div');
      Array.from(content.childNodes).forEach(child => {
        if ((child.nodeType === Node.ELEMENT_NODE && child.textContent.trim()) || (child.nodeType === Node.TEXT_NODE && child.textContent.trim())) {
          contentDiv.appendChild(child.cloneNode(true));
        }
      });
      rows.push([toggler.textContent.trim(), contentDiv]);
    }
  });

  const headerRow = ['Accordion (accordion33)'];
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
