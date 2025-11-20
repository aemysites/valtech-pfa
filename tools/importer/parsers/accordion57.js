/* global WebImporter */
export default function parse(element, { document }) {
  // --- HERO SECTION EXTRACTION ---
  // Extract heading, paragraph, and image (if present)
  const heading = element.querySelector('h2');
  const intro = element.querySelector('h2 + p');
  const image = element.querySelector('h2 + p + p img');

  // Compose a fragment for the hero section
  const heroFragment = document.createDocumentFragment();
  if (heading) heroFragment.appendChild(heading.cloneNode(true));
  if (intro) heroFragment.appendChild(intro.cloneNode(true));
  if (image) heroFragment.appendChild(image.cloneNode(true));

  // Insert hero section before the accordion block
  element.parentNode.insertBefore(heroFragment, element);

  // --- ACCORDION BLOCK EXTRACTION ---
  // Header row as per guidelines
  const headerRow = ['Accordion (accordion57)'];

  // Find all toggler elements (accordion headers)
  const togglers = Array.from(element.querySelectorAll('.accordions__toggler'));
  // Find all corresponding content elements
  const contents = Array.from(element.querySelectorAll('.accordions__element'));

  // Defensive: Ensure matching pairs
  const rows = [headerRow];
  for (let i = 0; i < togglers.length; i++) {
    const titleCell = togglers[i];
    const contentCell = contents[i];
    let contentBlock = contentCell;
    if (contentCell) {
      const teaser = contentCell.querySelector('.teasers__teaser');
      if (teaser) {
        contentBlock = teaser;
      }
    }
    rows.push([
      titleCell,
      contentBlock
    ]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the block
  element.replaceWith(block);
}
