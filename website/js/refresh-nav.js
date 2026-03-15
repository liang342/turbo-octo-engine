(function () {
  function buildNav() {
    if (document.querySelector('.topbar')) return;

    var path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    var nav = document.createElement('header');
    nav.className = 'topbar topbar-inject';
    nav.innerHTML = `
      <a class="brand" href="index.html">🐞 昆虫社</a>
      <nav class="menu">
        <a href="index.html" data-page="index.html">首页</a>
        <a href="blog.html" data-page="blog.html">个人 Blog</a>
        <a href="twocolumn1.html" data-page="twocolumn1.html">新手指南</a>
        <a href="twocolumn2.html" data-page="twocolumn2.html">留言</a>
        <a href="onecolumn.html" data-page="onecolumn.html">资源</a>
        <a href="threecolumn.html" data-page="threecolumn.html">网站推荐</a>
      </nav>
    `;

    var active = nav.querySelector('[data-page="' + path + '"]');
    if (active) active.classList.add('active');

    document.body.prepend(nav);
    document.body.classList.add('refresh-page', 'with-inject-topbar');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildNav);
  } else {
    buildNav();
  }
})();
