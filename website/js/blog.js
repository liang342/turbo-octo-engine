const STORAGE_KEY = "kunchongshe_posts";

function getPosts() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function savePosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

function createPostItem(post, index) {
  const card = document.createElement("article");
  card.className = "post-card";

  const title = document.createElement("h3");
  title.textContent = post.title;

  const meta = document.createElement("p");
  meta.className = "meta";
  meta.textContent = `${post.date}${post.tags ? ` · #${post.tags.split(',').map(t => t.trim()).filter(Boolean).join(' #')}` : ""}`;

  const body = document.createElement("p");
  body.className = "body";
  body.textContent = post.content;

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "btn btn-ghost small";
  removeBtn.textContent = "删除";
  removeBtn.addEventListener("click", () => {
    const posts = getPosts();
    posts.splice(index, 1);
    savePosts(posts);
    renderPosts();
  });

  card.append(title, meta, body, removeBtn);
  return card;
}

function renderPosts() {
  const list = document.getElementById("postList");
  const posts = getPosts();
  list.innerHTML = "";

  if (posts.length === 0) {
    list.innerHTML = '<p class="muted">还没有文章，开始写下第一篇吧。</p>';
    return;
  }

  posts.forEach((post, index) => {
    list.appendChild(createPostItem(post, index));
  });
}

document.getElementById("blogForm").addEventListener("submit", (event) => {
  event.preventDefault();

  const title = document.getElementById("title").value.trim();
  const tags = document.getElementById("tags").value.trim();
  const content = document.getElementById("content").value.trim();

  if (!title || !content) {
    return;
  }

  const posts = getPosts();
  posts.unshift({
    title,
    tags,
    content,
    date: new Date().toLocaleString("zh-CN", { hour12: false }),
  });

  savePosts(posts);
  event.target.reset();
  renderPosts();
});

document.getElementById("clearBtn").addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  renderPosts();
});

renderPosts();
