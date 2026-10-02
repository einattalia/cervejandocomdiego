/* Use the largest common height that fits every can without distortion. */
(() => {
  const shelf = document.querySelector('.fridge-shelves');
  if (!shelf) return;
  let frame;
  function fit() {
    const images = [...shelf.querySelectorAll('.can-stage > img')];
    const loaded = images.filter(img => img.naturalWidth && img.naturalHeight);
    if (!loaded.length) return;
    const height = Math.floor(Math.min(...loaded.map(img => {
      const stage = img.parentElement;
      const padding = parseFloat(getComputedStyle(stage).paddingBottom) || 0;
      return Math.min((stage.clientHeight - padding) * .8,
        stage.clientWidth * img.naturalHeight / img.naturalWidth);
    })));
    if (height > 0) shelf.style.setProperty('--fridge-can-height', height + 'px');
  }
  function schedule() { cancelAnimationFrame(frame); frame = requestAnimationFrame(fit); }
  shelf.addEventListener('load', schedule, true);
  new ResizeObserver(schedule).observe(shelf);
  new MutationObserver(schedule).observe(shelf, {
    childList: true, subtree: true, attributes: true, attributeFilter: ['src']
  });
  schedule();
})();
