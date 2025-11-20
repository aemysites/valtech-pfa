/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two main columns in the .row
  const row = element.querySelector('.row .row');
  if (!row) return;
  const columns = Array.from(row.children);
  if (columns.length < 2) return;

  // Header row
  const headerRow = ['Columns (columns44)'];

  // --- Left Column ---
  const leftCol = columns[0];
  const leftContent = [];

  // Heading
  const heading = leftCol.querySelector('h2');
  if (heading) leftContent.push(heading);

  // All paragraphs and lists except hidden heading and empty paragraphs
  leftCol.querySelectorAll('p, ul').forEach((el) => {
    if (el.textContent.trim()) leftContent.push(el);
  });

  // Red link (call-to-action)
  const cta = leftCol.querySelector('.accordions__toggler .more');
  if (cta) {
    // Find the parent .teasers__teaser for context
    const teaser = leftCol.querySelector('.teasers__teaser');
    if (teaser && teaser.contains(cta)) {
      // Find the strong > span (the underlined link text)
      const strong = cta.querySelector('strong span');
      if (strong) {
        // Create a link element for the CTA
        const link = document.createElement('a');
        link.href = '#'; // No href in source, so placeholder
        link.textContent = strong.textContent;
        link.style.color = 'red';
        leftContent.push(link);
      }
    }
  }

  // --- Right Column ---
  const rightCol = columns[1];
  const rightContent = [];

  // Video embed (iframe) as a link
  const iframe = rightCol.querySelector('iframe');
  if (iframe && iframe.src) {
    const videoLink = document.createElement('a');
    videoLink.href = iframe.src;
    videoLink.textContent = 'Video: Online Læge';
    videoLink.target = '_blank';
    rightContent.push(videoLink);
  }

  // Caption under video
  const caption = rightCol.querySelector('em, span[style*="font-size"]');
  if (caption && caption.textContent.trim()) {
    rightContent.push(caption);
  }

  // --- Table Construction ---
  const cells = [
    headerRow,
    [leftContent, rightContent]
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
