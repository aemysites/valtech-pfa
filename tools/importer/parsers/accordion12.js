/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion (accordion12) block parser
  // Model fields: title, content
  // Extract all accordion items: each with a title and content
  // HTML comments for model fields
  // <!-- title -->, <!-- content -->

  const headerRow = ['Accordion (accordion12)'];
  const rows = [headerRow];

  // Find all .teasers__teaser blocks (each is a group of accordion items)
  const teaserBlocks = Array.from(element.querySelectorAll('.teasers__teaser'));

  teaserBlocks.forEach((teaser) => {
    // Find all toggler elements that are direct children of the teaser
    const togglers = Array.from(teaser.children).filter(
      (child) => child.classList && child.classList.contains('accordions__toggler')
    );
    togglers.forEach((toggler) => {
      // The content element is the next sibling with class 'accordions__element'
      let content = toggler.nextElementSibling;
      if (!content || !content.classList.contains('accordions__element')) {
        // Defensive: fallback to searching for sibling with correct class
        content = Array.from(teaser.children).find(
          (el) => el.classList && el.classList.contains('accordions__element') && el.previousElementSibling === toggler
        );
      }
      if (!content || !content.classList.contains('accordions__element')) {
        // Defensive: skip if structure is not as expected
        return;
      }
      // Insert HTML comments for model fields
      const titleCell = document.createElement('div');
      titleCell.appendChild(document.createComment('title'));
      titleCell.appendChild(toggler);
      const contentCell = document.createElement('div');
      contentCell.appendChild(document.createComment('content'));
      contentCell.appendChild(content);
      rows.push([titleCell, contentCell]);
    });
  });

  // Defensive fallback: if no teaserBlocks found, try direct accordions
  if (rows.length === 1) {
    const togglers = Array.from(element.querySelectorAll('.accordions__toggler'));
    togglers.forEach((toggler) => {
      let content = toggler.nextElementSibling;
      if (!content || !content.classList.contains('accordions__element')) {
        content = Array.from(element.children).find(
          (el) => el.classList && el.classList.contains('accordions__element') && el.previousElementSibling === toggler
        );
      }
      if (content && content.classList.contains('accordions__element')) {
        const titleCell = document.createElement('div');
        titleCell.appendChild(document.createComment('title'));
        titleCell.appendChild(toggler);
        const contentCell = document.createElement('div');
        contentCell.appendChild(document.createComment('content'));
        contentCell.appendChild(content);
        rows.push([titleCell, contentCell]);
      }
    });
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
