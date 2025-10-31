/* global WebImporter */
import { TransformHook } from './transform.js';

export default function transform(hookName, element) {
    if (hookName === TransformHook.beforePageTransform) {
        [...element.querySelectorAll('.teasers__heading')].forEach((heading) => {
            // remove the heading if it has a style of display none
            if (heading.style.display === 'none') {
                heading.remove();
            }
        });
    }
}
