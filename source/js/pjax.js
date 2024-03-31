/*document.addEventListener("pjax:complete", function () {
    load_twikoo();
    window.lazyLoadInstance?.update();
});*/
document.addEventListener('pjax:complete', function () {
    document.querySelectorAll('script[data-pjax]').forEach(item => {
      const newScript = document.createElement('script')
      const content = item.text || item.textContent || item.innerHTML || ""
      Array.from(item.attributes).forEach(attr => newScript.setAttribute(attr.name, attr.value))
      newScript.appendChild(document.createTextNode(content))
      item.parentNode.replaceChild(newScript, item)
    })
    load_twikoo();
    window.lazyLoadInstance?.update();
});
document.addEventListener('pjax:error', (e) => {
    if (e.request.status === 404) {
      pjax.loadUrl('/404.html')
    }
  })