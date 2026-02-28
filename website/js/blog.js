const STORAGE_KEY = "kunchongshe_posts";
const DRAFT_KEY = "kunchongshe_draft";

const blogForm = document.getElementById("blogForm");
const editingIdInput = document.getElementById("editingId");
const titleInput = document.getElementById("title");
const tagsInput = document.getElementById("tags");
const contentInput = document.getElementById("content");
const postList = document.getElementById("postList");
const clearBtn = document.getElementById("clearBtn");
const exportBtn = document.getElementById("exportBtn");
const searchInput = document.getElementById("searchInput");
const wordCount = document.getElementById("wordCount");
const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

function getPosts() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function savePosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

function formatTags(tagsString) {
  return tagsString
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function updateWordCount() {
  const content = contentInput.value.trim();
  wordCount.textContent = `${content.length} 字`;
}

function clearDraft() {
  localStorage.removeItem(DRAFT_KEY);
}

function saveDraft() {
  const draft = {
    title: titleInput.value,
    tags: tagsInput.value,
    content: contentInput.value,
  };
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

function loadDraft() {
  const raw = localStorage.getItem(DRAFT_KEY);
  if (!raw) {
    updateWordCount();
    return;
  }

  const draft = JSON.parse(raw);
  titleInput.value = draft.title || "";
  tagsInput.value = draft.tags || "";
  contentInput.value = draft.content || "";
  updateWordCount();
}

function resetFormState() {
  blogForm.reset();
  editingIdInput.value = "";
  formTitle.textContent = "发布新文章";
  submitBtn.textContent = "发布文章";
  cancelEditBtn.classList.add("hidden");
  clearDraft();
  updateWordCount();
}

function startEdit(postId) {
  const posts = getPosts();
  const target = posts.find((post) => post.id === postId);
  if (!target) {
    return;
  }

  editingIdInput.value = postId;
  titleInput.value = target.title;
  tagsInput.value = target.tags;
  contentInput.value = target.content;
  formTitle.textContent = "编辑文章";
  submitBtn.textContent = "更新文章";
  cancelEditBtn.classList.remove("hidden");
  updateWordCount();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function createPostItem(post) {
  const card = document.createElement("article");
  card.className = "post-card";

  const tags = formatTags(post.tags);
  card.innerHTML = `
    <h3>${post.title}</h3>
    <p class="meta">${post.date}${tags.length ? ` · #${tags.join(" #")}` : ""}</p>
    <p class="body">${post.content}</p>
    <div class="card-actions">
      <button class="btn btn-ghost small" data-action="edit" data-id="${post.id}" type="button">编辑</button>
      <button class="btn btn-ghost small" data-action="delete" data-id="${post.id}" type="button">删除</button>
    </div>
  `;

  return card;
}

function renderPosts() {
  const keyword = searchInput.value.trim().toLowerCase();
  const posts = getPosts();

  const filtered = posts.filter((post) => {
    if (!keyword) {
      return true;
    }
    return [post.title, post.tags, post.content].join(" ").toLowerCase().includes(keyword);
  });

  postList.innerHTML = "";

  if (filtered.length === 0) {
    postList.innerHTML = '<p class="muted">没有匹配文章，试试其他关键词。</p>';
    return;
  }

  filtered.forEach((post) => {
    postList.appendChild(createPostItem(post));
  });
}

blogForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const tags = tagsInput.value.trim();
  const content = contentInput.value.trim();
  const editingId = editingIdInput.value;

  if (!title || !content) {
    return;
  }

  const posts = getPosts();

  if (editingId) {
    const idx = posts.findIndex((post) => post.id === editingId);
    if (idx >= 0) {
      posts[idx] = {
        ...posts[idx],
        title,
        tags,
        content,
        updatedAt: new Date().toISOString(),
        date: `${posts[idx].createdAtLabel}（已更新）`,
      };
    }
  } else {
    const now = new Date();
    posts.unshift({
      id: `${Date.now()}_${Math.random().toString(16).slice(2, 8)}`,
      title,
      tags,
      content,
      createdAt: now.toISOString(),
      createdAtLabel: now.toLocaleString("zh-CN", { hour12: false }),
      date: now.toLocaleString("zh-CN", { hour12: false }),
    });
  }

  savePosts(posts);
  resetFormState();
  renderPosts();
});

postList.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const action = target.getAttribute("data-action");
  const id = target.getAttribute("data-id");

  if (!action || !id) {
    return;
  }

  if (action === "edit") {
    startEdit(id);
    return;
  }

  if (action === "delete") {
    const posts = getPosts().filter((post) => post.id !== id);
    savePosts(posts);
    renderPosts();
  }
});

clearBtn.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  resetFormState();
  renderPosts();
});

exportBtn.addEventListener("click", () => {
  const posts = getPosts();
  const blob = new Blob([JSON.stringify(posts, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "kunchongshe-blog-export.json";
  a.click();
  URL.revokeObjectURL(url);
});

searchInput.addEventListener("input", renderPosts);
titleInput.addEventListener("input", saveDraft);
tagsInput.addEventListener("input", saveDraft);
contentInput.addEventListener("input", () => {
  saveDraft();
  updateWordCount();
});

cancelEditBtn.addEventListener("click", () => {
  resetFormState();
  loadDraft();
});

loadDraft();
renderPosts();
