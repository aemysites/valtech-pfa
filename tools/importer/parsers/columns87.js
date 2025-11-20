/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Columns (columns87)'];

  // Get the columns
  const columns = Array.from(element.querySelectorAll(':scope > div'));

  // Left column: image only
  let leftColContent = [];
  if (columns[0]) {
    const img = columns[0].querySelector('img');
    if (img) leftColContent.push(img);
  }

  // Right column: all text content, with proper list and toggler formatting
  let rightColContent = [];
  if (columns[1]) {
    // Collect heading
    const heading = columns[1].querySelector('h5');
    if (heading) rightColContent.push(heading.cloneNode(true));

    // Collect first paragraph (intro)
    const introP = columns[1].querySelector('p:not(.accordions__toggler):not(.accordion__element)');
    if (introP) rightColContent.push(introP.cloneNode(true));

    // Collect 'Læs mere' and 'Se mindre' together as a toggler paragraph
    const toggler = columns[1].querySelector('.read-more .accordions__toggler');
    if (toggler) {
      const togglerP = document.createElement('p');
      togglerP.className = 'accordions__toggler';
      const moreSpan = toggler.querySelector('.more');
      const lessSpan = toggler.querySelector('.less');
      if (moreSpan) {
        const more = document.createElement('span');
        more.className = 'more';
        more.textContent = moreSpan.textContent.trim();
        togglerP.appendChild(more);
      }
      if (lessSpan) {
        const less = document.createElement('span');
        less.className = 'less';
        less.textContent = lessSpan.textContent.trim();
        togglerP.appendChild(less);
      }
      rightColContent.push(togglerP);
    }

    // Collect accordion content (main body)
    const accordionContent = columns[1].querySelector('.read-more .accordion__element');
    if (accordionContent) {
      // This paragraph contains the bullet list as text. We'll convert to <ul><li>...
      // Split by <br> and look for lines starting with '•'
      const lines = accordionContent.innerHTML.split('<br>');
      const ul = document.createElement('ul');
      let summaryParts = [];
      lines.forEach(line => {
        const txt = line.replace(/&nbsp;/g, '').trim();
        if (txt.startsWith('•')) {
          const li = document.createElement('li');
          li.textContent = txt.replace(/^•\s*/, '');
          ul.appendChild(li);
        } else if (txt !== '') {
          summaryParts.push(txt);
        }
      });
      // Add the list only if it has items
      if (ul.children.length) rightColContent.push(ul);
      // Add any remaining summary text before/after the list
      summaryParts.forEach(part => {
        const p = document.createElement('p');
        p.textContent = part;
        rightColContent.push(p);
      });
    }

    // Collect final policy paragraph (after accordion)
    const finalP = Array.from(columns[1].querySelectorAll('p')).find(p => p.className === '' && p.textContent.includes('PFA anvender ikke kunstig intelligens'));
    if (finalP) rightColContent.push(finalP.cloneNode(true));
  }

  // Compose the table rows
  const cells = [
    headerRow,
    [leftColContent, rightColContent]
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
