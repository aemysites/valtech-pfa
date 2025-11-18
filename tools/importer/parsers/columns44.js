/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two main columns
  const columns = Array.from(element.querySelectorAll('.row > .col-xs-12'));

  // Defensive fallback if not found
  if (columns.length < 2) {
    const innerRows = element.querySelectorAll('.row');
    if (innerRows.length) {
      const firstRowCols = innerRows[0].querySelectorAll(':scope > .col-xs-12');
      if (firstRowCols.length === 2) {
        columns[0] = firstRowCols[0];
        columns[1] = firstRowCols[1];
      }
    }
  }

  // --- LEFT COLUMN ---
  let leftColContent = [];
  if (columns[0]) {
    // Heading
    const heading = columns[0].querySelector('h2');
    if (heading) leftColContent.push(heading);

    // Main teaser content (paragraphs, list)
    const teaser = columns[0].querySelector('.teasers__teaser');
    if (teaser) leftColContent.push(teaser);

    // Accordion (toggler and content)
    const accordion = columns[0].querySelector('.accordions__toggler');
    const accordionContent = columns[0].querySelector('.accordion__element');
    if (accordion && accordionContent) {
      // Get both toggler states: 'more' and 'less'
      const moreSpan = accordion.querySelector('.more');
      const lessSpan = accordion.querySelector('.less');
      if (moreSpan && lessSpan) {
        // Compose both toggler states as text
        const togglerDiv = document.createElement('div');
        togglerDiv.appendChild(document.createElement('strong')).innerHTML = `<span style="text-decoration: underline;">${moreSpan.textContent}</span>`;
        togglerDiv.appendChild(document.createElement('strong')).innerHTML = `<span style="text-decoration: underline;">${lessSpan.textContent}</span>`;
        leftColContent.push(togglerDiv);
      } else if (moreSpan) {
        leftColContent.push(moreSpan);
      }
      // Add the accordion content
      leftColContent.push(accordionContent);
    }
  }

  // --- RIGHT COLUMN ---
  let rightColContent = [];
  if (columns[1]) {
    // Find the video embed wrapper
    const videoWrapper = columns[1].querySelector('div[style*="padding-bottom"]');
    if (videoWrapper) {
      const iframe = videoWrapper.querySelector('iframe');
      if (iframe) {
        const videoLink = document.createElement('a');
        videoLink.href = iframe.src;
        videoLink.textContent = 'Video: Online Læge';
        rightColContent.push(videoLink);
      }
    }
    // Caption below video
    const caption = columns[1].querySelector('em, span[style*="font-size"]');
    if (caption) rightColContent.push(caption);
  }

  // Compose table rows
  const headerRow = ['Columns (columns44)'];
  const contentRow = [leftColContent, rightColContent];

  // Create table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace original element
  element.replaceWith(table);
}
