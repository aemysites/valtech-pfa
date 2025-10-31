/* global WebImporter */
import { TransformHook } from './transform.js';

export default function transform(hookName, element, { document }) {
    if (hookName === TransformHook.beforePageTransform) {
        const iframeElements = document.querySelectorAll('iframe');
        for(const iframe of iframeElements) {
          if (iframe.src.includes('player.html')) {
            const videoLink = document.createElement('a');
            videoLink.href = iframe.src;
            videoLink.textContent = 'Video Player';
            iframe.replaceWith(videoLink);
          }
        }
    }
}
