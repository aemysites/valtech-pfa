/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion141)'];

  // Find heading (first h2 in the block)
  const heading = element.querySelector('h2');

  // Find all accordion toggler elements (titles/questions)
  const togglers = Array.from(element.querySelectorAll('.accordions__toggler'));
  // Find all accordion content elements (answers/bodies)
  const contents = Array.from(element.querySelectorAll('.accordions__element'));

  // Defensive: Only pair up as many items as both toggler and content exist
  const itemCount = Math.min(togglers.length, contents.length);

  // Build rows for each accordion item: [title, content]
  const rows = [];
  for (let i = 0; i < itemCount; i++) {
    rows.push([
      togglers[i], // Use the original toggler element for the title cell
      contents[i], // Use the original content element for the body cell
    ]);
  }

  // Find the footer/contact line (centered <p> with phone number)
  let footer = null;
  const footerCandidates = Array.from(element.querySelectorAll('p'));
  for (const p of footerCandidates) {
    if (p.textContent.includes('Hvis du har spørgsmål') && p.textContent.includes('70 80 82 47')) {
      footer = p;
      break;
    }
  }

  // Compose the block table rows
  const tableRows = [headerRow];
  // Add heading as a row if found
  if (heading) {
    tableRows.push([heading, '']);
  }
  // Add all accordion items
  tableRows.push(...rows);
  // Add the footer as a row if found
  if (footer) {
    tableRows.push(['', footer]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
