/* Equal visual height for product cutouts, including replacement uploads. */
(() => {
  const selector = '#beerCatalogGrid .beer-3d > img, .fridge-can img';
  const cache = new Map();
  const pending = new WeakMap();

  function normalizedSource(source) {
    if (cache.has(source)) return cache.get(source);
    const result = new Promise(resolve => {
      // Use a separate image so a CORS failure never hides the original.
      const probe = new Image();
      probe.crossOrigin = 'anonymous';
      probe.onerror = () => resolve(source);
      probe.onload = () => {
        try {
          const ratio = Math.min(1, 400 / Math.max(probe.naturalWidth, probe.naturalHeight));
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.round(probe.naturalWidth * ratio));
          canvas.height = Math.max(1, Math.round(probe.naturalHeight * ratio));
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          ctx.drawImage(probe, 0, 0, canvas.width, canvas.height);
          const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
          let left = canvas.width, top = canvas.height, right = -1, bottom = -1;
          for (let y = 0; y < canvas.height; y++) {
            for (let x = 0; x < canvas.width; x++) {
              if (pixels[(y * canvas.width + x) * 4 + 3] > 16) {
                left = Math.min(left, x); right = Math.max(right, x);
                top = Math.min(top, y); bottom = Math.max(bottom, y);
              }
            }
          }
          if (right < left) return resolve(source);
          // Retain one scan pixel around the cutout to preserve soft edges.
          left = Math.max(0, left - 1); top = Math.max(0, top - 1);
          right = Math.min(canvas.width - 1, right + 1);
          bottom = Math.min(canvas.height - 1, bottom + 1);
          const sx = left / canvas.width * probe.naturalWidth;
          const sy = top / canvas.height * probe.naturalHeight;
          const sw = (right - left + 1) / canvas.width * probe.naturalWidth;
          const sh = (bottom - top + 1) / canvas.height * probe.naturalHeight;
          const output = document.createElement('canvas');
          output.height = 720;
          output.width = Math.max(1, Math.round(720 * sw / sh));
          output.getContext('2d').drawImage(probe, sx, sy, sw, sh, 0, 0, output.width, output.height);
          resolve(output.toDataURL('image/png'));
        } catch {
          resolve(source);
        }
      };
      probe.src = source;
    });
    cache.set(source, result);
    return result;
  }

  function normalize(img) {
    const source = img.getAttribute('src');
    if (!source || source.startsWith('data:') || pending.get(img) === source) return;
    pending.set(img, source);
    normalizedSource(source).then(result => {
      if (img.getAttribute('src') === source && result !== source) {
        img.src = result;
      }
    });
  }

  function scan(root) {
    if (root.matches?.(selector)) normalize(root);
    root.querySelectorAll?.(selector).forEach(normalize);
  }

  scan(document);
  new MutationObserver(records => {
    for (const record of records) {
      if (record.type === 'attributes') {
        if (record.target.matches(selector)) normalize(record.target);
      } else {
        record.addedNodes.forEach(scan);
      }
    }
  }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
})();