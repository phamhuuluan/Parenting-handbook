/**
 * Parenting Handbook — client behavior (lang, theme, search, read resume, icons).
 * Depends on assets/js/i18n.js (window.HANDBOOK_I18N).
 */
(function () {
  "use strict";

  var I18N = window.HANDBOOK_I18N || {};
  var READ_UI = I18N.READ_UI || {};
  var SEARCH_UI = I18N.SEARCH_UI || {};
  var SHARE_UI = I18N.SHARE_UI || {};
  var BOOKMARK_UI = I18N.BOOKMARK_UI || {};
  var LANG_MENU_UI = I18N.LANG_MENU_UI || {};
  var LANG_SHORT = I18N.LANG_SHORT || {};
  var LANG_NAMES = I18N.LANG_NAMES || {};
  var THEME_LABELS = I18N.THEME_LABELS || {};
  var THEME_COLORS = I18N.THEME_COLORS || { light: "#fafaf9", dark: "#111110" };

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

var STORAGE_KEY = "handbook-lang";
var READ_KEY = "handbook-read";
var BOOKMARK_KEY = "handbook-bookmarks";
var READ_MIN_Y = 160;
var LANGS = ["vi", "en", "ja", "ko", "zh"];
var DEFAULT_LANG = "vi";
var SPRITE_URL = "assets/sprites.svg";

function appendSpriteIcon(btn, symbolId, className) {
  if (!btn) return null;
  var rootClass = className.split(" ")[0];
  if (btn.querySelector("." + rootClass)) return null;
  var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "icon " + className);
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("viewBox", "0 0 24 24");
  var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttribute("href", SPRITE_URL + "#" + symbolId);
  svg.appendChild(use);
  btn.appendChild(svg);
  return svg;
}

function appendCopyIcon(btn) {
  appendSpriteIcon(btn, "icon-copy", "icon-copy");
}

function appendBookmarkIcons(btn) {
  if (!btn || btn.querySelector(".icon-bookmark-outline")) return;
  function mk(symbolId, extraClass) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "icon icon-bookmark " + extraClass);
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("viewBox", "0 0 24 24");
    var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", SPRITE_URL + "#" + symbolId);
    svg.appendChild(use);
    return svg;
  }
  btn.appendChild(mk("icon-bookmark", "icon-bookmark-outline"));
  btn.appendChild(mk("icon-bookmark-filled", "icon-bookmark-filled"));
}
var body = document.body;
var readResumeWrap = document.getElementById("read-resume");
var readResumeBtn = document.getElementById("read-resume-action");
var readResumeDismiss = document.getElementById("read-resume-dismiss");
var readResumeText = readResumeBtn && readResumeBtn.querySelector(".read-resume-text");
var readSaveTimer = null;
var readInitDone = false;
var readResumeHideTimer = null;

var searchDialog = document.getElementById("search-dialog");
var searchInput = document.getElementById("search-input");
var searchResults = document.getElementById("search-results");
var searchHint = document.getElementById("search-hint");
var searchOpenBtn = document.getElementById("search-open-btn");
var searchCloseBtn = document.getElementById("search-close");
var searchTitleEl = document.getElementById("search-dialog-title");
var copyToast = document.getElementById("copy-toast");
var searchIndex = [];
var searchIndexByLang = Object.create(null);
var searchDebounce = null;
var searchPickIndex = -1;
var copyToastTimer = null;

var bookmarksDialog = document.getElementById("bookmarks-dialog");
var bookmarksList = document.getElementById("bookmarks-list");
var bookmarksHint = document.getElementById("bookmarks-hint");
var bookmarksOpenBtn = document.getElementById("bookmarks-open-btn");
var bookmarksCloseBtn = document.getElementById("bookmarks-close");
var bookmarksTitleEl = document.getElementById("bookmarks-dialog-title");
var langMenuBtn = document.getElementById("lang-menu-btn");
var langMenuCurrent = document.getElementById("lang-menu-current");
var langDialog = document.getElementById("lang-dialog");
var langCloseBtn = document.getElementById("lang-close");
var langDialogTitle = document.getElementById("lang-dialog-title");
var langDialogList = document.getElementById("lang-dialog-list");

function allLangButtons() {
  return document.querySelectorAll(".lang-switch button[data-lang], .lang-dialog-option[data-lang]");
}

function langOnlyClass() {
  return currentLang + "-only";
}

function foldText(s) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}


function fallbackCopy(text, onDone) {
  var ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.left = "-9999px";
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand("copy");
    if (onDone) onDone();
  } catch (e) {}
  document.body.removeChild(ta);
}

function showCopyToast(message) {
  if (!copyToast) return;
  copyToast.textContent = message;
  copyToast.hidden = false;
  copyToast.classList.add("visible");
  if (copyToastTimer) clearTimeout(copyToastTimer);
  copyToastTimer = setTimeout(function () {
    copyToast.classList.remove("visible");
    copyToast.hidden = true;
  }, 2200);
}

function getLangContentBlock(section) {
  var cls = langOnlyClass();
  var blocks = section.querySelectorAll("div." + cls);
  var best = null;
  for (var i = 0; i < blocks.length; i++) {
    var b = blocks[i];
    if (b.closest(".principle-header")) continue;
    if (!best || b.textContent.length > best.textContent.length) {
      best = b;
    }
  }
  return best;
}

function getSectionCopyText(sectionId) {
  var section = document.getElementById(sectionId);
  if (!section) return "";
  var cls = langOnlyClass();
  var block = getLangContentBlock(section);
  if (!block) return "";

  var ui = SEARCH_UI[currentLang] || SEARCH_UI.vi;
  var lines = [];
  var titleEl = section.querySelector(".principle-header .principle-title." + cls);
  var numMatch = /^p(\d+)$/.exec(sectionId);
  if (titleEl && numMatch) {
    lines.push(ui.article.replace("{n}", numMatch[1]) + " — " + titleEl.textContent.replace(/\s+/g, " ").trim());
    lines.push("");
  }

  var walker = document.createTreeWalker(block, NodeFilter.SHOW_ELEMENT);
  var node;
  while ((node = walker.nextNode())) {
    var text = "";
    if (node.tagName === "P") {
      if (node.closest(".line")) continue;
      text = (node.textContent || "").replace(/\s+/g, " ").trim();
      if (!text) continue;
      if (node.classList.contains("label") || node.classList.contains("principle-note-kicker")) {
        if (lines.length && lines[lines.length - 1] !== "") lines.push("");
        lines.push(text);
        if (node.classList.contains("label")) lines.push("");
      } else {
        lines.push(text);
      }
    } else if (node.tagName === "LI") {
      text = (node.textContent || "").replace(/\s+/g, " ").trim();
      if (text) lines.push("• " + text);
    } else if (node.classList.contains("line")) {
      var parts = [];
      for (var c = 0; c < node.children.length; c++) {
        if (node.children[c].tagName === "P") parts.push(node.children[c]);
      }
      if (parts.length > 1) {
        parts.forEach(function (p) {
          var t = (p.textContent || "").replace(/\s+/g, " ").trim();
          if (t) lines.push(t);
        });
      } else {
        text = (node.textContent || "").replace(/\s+/g, " ").trim();
        if (text) lines.push(text);
      }
    }
  }

  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

function copyToClipboard(text, onDone) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(onDone).catch(function () {
      fallbackCopy(text, onDone);
    });
  } else {
    fallbackCopy(text, onDone);
  }
}

function copySectionContent(sectionId, triggerBtn) {
  var ui = SHARE_UI[currentLang] || SHARE_UI.vi;
  var text = getSectionCopyText(sectionId);
  if (!text) {
    showCopyToast(ui.failed);
    return;
  }
  var onDone = function () {
    showCopyToast(ui.copied);
    if (triggerBtn) {
      triggerBtn.classList.add("is-copied");
      setTimeout(function () { triggerBtn.classList.remove("is-copied"); }, 1800);
    }
  };
  copyToClipboard(text, onDone);
}

function syncUrlLang(lang) {
  try {
    var url = new URL(window.location.href);
    url.searchParams.set("lang", lang);
    history.replaceState(null, "", url.pathname + url.search + url.hash);
  } catch (e) {}
}

function shareAriaForSection(sectionId) {
  var ui = SHARE_UI[currentLang] || SHARE_UI.vi;
  var m = /^p(\d+)$/.exec(sectionId || "");
  if (m) return ui.section.replace("{n}", m[1]);
  return ui.section.replace("{n}", "");
}

function searchMetaForSection(sectionId) {
  var ui = SEARCH_UI[currentLang] || SEARCH_UI.vi;
  if (sectionId === "intro") return ui.intro;
  if (sectionId === "closing") return ui.closing;
  var m = /^p(\d+)$/.exec(sectionId || "");
  if (m) return ui.article.replace("{n}", m[1]);
  return sectionId;
}

function rebuildSearchIndex(force) {
  if (!force && searchIndexByLang[currentLang]) {
    searchIndex = searchIndexByLang[currentLang];
    return;
  }
  var next = [];
  var cls = langOnlyClass();
  var sel = "main section[id], main footer#closing";
  document.querySelectorAll(sel).forEach(function (section) {
    var sectionId = section.id;
    if (!sectionId) return;
    var meta = searchMetaForSection(sectionId);
    var nodes = section.querySelectorAll(
      "." + cls + " p, ." + cls + " li, ." + cls + " blockquote, ." + cls + " h2, ." + cls + " h3"
    );
    nodes.forEach(function (el) {
      var text = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (text.length < 10) return;
      next.push({ sectionId: sectionId, meta: meta, el: el, text: text });
    });
  });
  searchIndexByLang[currentLang] = next;
  searchIndex = next;
}

function snippetHtml(text, query) {
  var folded = foldText(text);
  var q = foldText(query);
  var idx = folded.indexOf(q);
  if (idx === -1) return escapeHtml(text.slice(0, 120)) + (text.length > 120 ? "…" : "");
  var start = Math.max(0, idx - 36);
  var end = Math.min(text.length, idx + q.length + 56);
  var slice = text.slice(start, end);
  var localIdx = foldText(slice).indexOf(q);
  if (localIdx === -1) return escapeHtml(slice) + (end < text.length ? "…" : "");
  var before = slice.slice(0, localIdx);
  var matchBit = slice.slice(localIdx, localIdx + q.length);
  var after = slice.slice(localIdx + q.length);
  var prefix = start > 0 ? "…" : "";
  var suffix = end < text.length ? "…" : "";
  return prefix + escapeHtml(before) + "<mark>" + escapeHtml(matchBit) + "</mark>" + escapeHtml(after) + suffix;
}

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderSearchResults(query) {
  if (!searchResults || !searchHint) return;
  var ui = SEARCH_UI[currentLang] || SEARCH_UI.vi;
  searchResults.innerHTML = "";
  searchPickIndex = -1;
  var q = (query || "").trim();
  if (q.length < 2) {
    searchHint.textContent = q.length ? ui.short : ui.hint + " · " + ui.shortcut;
    return;
  }
  var fq = foldText(q);
  var hits = [];
  searchIndex.forEach(function (entry) {
    if (foldText(entry.text).indexOf(fq) !== -1) hits.push(entry);
  });
  if (!hits.length) {
    searchHint.textContent = ui.empty;
    return;
  }
  searchHint.textContent = hits.length + (currentLang === "vi" ? " kết quả" : " result(s)");
  var frag = document.createDocumentFragment();
  hits.slice(0, 24).forEach(function (entry, i) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "search-result-btn";
    btn.setAttribute("role", "option");
    btn.dataset.index = String(i);
    btn.innerHTML =
      '<span class="search-result-meta">' + escapeHtml(entry.meta) + "</span>" +
      '<span class="search-result-snippet">' + snippetHtml(entry.text, q) + "</span>";
    frag.appendChild(btn);
  });
  searchResults.appendChild(frag);
  searchResults._hits = hits;
}

function setSearchPick(index) {
  if (!searchResults) return;
  var buttons = searchResults.querySelectorAll(".search-result-btn");
  searchPickIndex = index;
  buttons.forEach(function (btn, i) {
    btn.classList.toggle("is-active", i === index);
  });
  if (index >= 0 && buttons[index]) {
    buttons[index].scrollIntoView({ block: "nearest" });
  }
}

function gotoSearchResult(entry) {
  if (!entry || !entry.el) return;
  closeSearch();
  document.querySelectorAll(".search-flash").forEach(function (n) {
    n.classList.remove("search-flash");
  });
  entry.el.classList.add("search-flash");
  entry.el.scrollIntoView({ behavior: "smooth", block: "center" });
  setTimeout(function () {
    entry.el.classList.remove("search-flash");
  }, 2600);
  if (entry.sectionId) {
    try {
      var url = new URL(window.location.href);
      url.searchParams.set("lang", currentLang);
      url.hash = entry.sectionId;
      history.replaceState(null, "", url.pathname + url.search + url.hash);
    } catch (e) {}
  }
}

function openSearch() {
  if (!searchDialog || !searchInput) return;
  updateSearchShareUI();
  rebuildSearchIndex(false);
  searchInput.value = "";
  renderSearchResults("");
  if (typeof searchDialog.showModal === "function") {
    searchDialog.showModal();
  } else {
    searchDialog.setAttribute("open", "");
  }
  setTimeout(function () { searchInput.focus(); }, 50);
}

function closeSearch() {
  if (!searchDialog) return;
  if (typeof searchDialog.close === "function") searchDialog.close();
  else searchDialog.removeAttribute("open");
}

var DESKTOP_MQ = window.matchMedia("(min-width: 1024px)");
var tocEl = document.getElementById("toc");
var tocSidebar = document.getElementById("toc-sidebar");
var tocSlotMobile = document.getElementById("toc-slot-mobile");
var lastTocSpyId = null;

function scrollSidebarTocToActive(link) {
  if (!DESKTOP_MQ.matches || !tocSidebar || !link || !tocSidebar.contains(link)) return;
  var sbRect = tocSidebar.getBoundingClientRect();
  var linkRect = link.getBoundingClientRect();
  if (linkRect.top < sbRect.top + 4 || linkRect.bottom > sbRect.bottom - 4) {
    link.scrollIntoView({ block: "nearest" });
  }
}

function placeToc() {
  if (!tocEl || !tocSidebar || !tocSlotMobile) return;
  if (DESKTOP_MQ.matches) {
    if (tocEl.parentElement !== tocSidebar) tocSidebar.appendChild(tocEl);
    tocEl.classList.add("toc--sidebar");
    tocSidebar.setAttribute("aria-hidden", "false");
  } else {
    if (tocEl.parentElement !== tocSlotMobile) tocSlotMobile.appendChild(tocEl);
    tocEl.classList.remove("toc--sidebar");
    tocSidebar.setAttribute("aria-hidden", "true");
    lastTocSpyId = null;
  }
}

function initPageLayout() {
  placeToc();
  if (typeof DESKTOP_MQ.addEventListener === "function") {
    DESKTOP_MQ.addEventListener("change", placeToc);
  } else if (typeof DESKTOP_MQ.addListener === "function") {
    DESKTOP_MQ.addListener(placeToc);
  }
}

function syncTocSpy() {
  var activeId = getActiveSectionId();
  var isPrinciple = /^p\d+$/.test(activeId || "");
  var activeLink = null;
  document.querySelectorAll(".toc-list a[href^='#p']").forEach(function (link) {
    var sid = (link.getAttribute("href") || "").replace("#", "");
    var isActive = isPrinciple && sid === activeId;
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "location");
      activeLink = link;
    } else {
      link.removeAttribute("aria-current");
    }
  });
  if (activeLink && activeId !== lastTocSpyId) {
    lastTocSpyId = activeId;
    scrollSidebarTocToActive(activeLink);
  }
  if (!isPrinciple) lastTocSpyId = null;
}

function updateLangMenuUI() {
  var ui = LANG_MENU_UI[currentLang] || LANG_MENU_UI.vi;
  var dismiss = (READ_UI[currentLang] || READ_UI.vi).dismiss;
  if (langMenuCurrent) {
    langMenuCurrent.textContent = LANG_SHORT[currentLang] || currentLang.toUpperCase();
  }
  if (langMenuBtn) {
    langMenuBtn.setAttribute("aria-label", ui.open);
    langMenuBtn.setAttribute("title", ui.open);
  }
  if (langDialogTitle) langDialogTitle.textContent = ui.title;
  if (langCloseBtn) langCloseBtn.setAttribute("aria-label", dismiss);
  if (langDialogList) langDialogList.setAttribute("aria-label", ui.title);
  document.querySelectorAll(".lang-dialog-option[data-lang]").forEach(function (btn) {
    var code = btn.getAttribute("data-lang");
    var nameEl = btn.querySelector(".lang-dialog-name");
    var codeEl = btn.querySelector(".lang-dialog-code");
    if (nameEl) nameEl.textContent = LANG_NAMES[code] || code;
    if (codeEl) codeEl.textContent = LANG_SHORT[code] || code;
    btn.setAttribute("aria-label", LANG_NAMES[code] || code);
  });
}

function openLangDialog() {
  if (!langDialog) return;
  updateLangMenuUI();
  if (typeof langDialog.showModal === "function") langDialog.showModal();
  else langDialog.setAttribute("open", "");
  if (langMenuBtn) langMenuBtn.setAttribute("aria-expanded", "true");
}

function closeLangDialog() {
  if (!langDialog) return;
  if (typeof langDialog.close === "function") langDialog.close();
  else langDialog.removeAttribute("open");
  if (langMenuBtn) langMenuBtn.setAttribute("aria-expanded", "false");
}

function initLangMenu() {
  if (langMenuBtn) langMenuBtn.addEventListener("click", openLangDialog);
  if (langCloseBtn) langCloseBtn.addEventListener("click", closeLangDialog);
  if (langDialog) {
    langDialog.addEventListener("click", function (e) {
      if (e.target === langDialog) closeLangDialog();
    });
    langDialog.addEventListener("close", function () {
      if (langMenuBtn) langMenuBtn.setAttribute("aria-expanded", "false");
    });
  }
  allLangButtons().forEach(function (btn) {
    if (btn._langBound) return;
    btn._langBound = true;
    btn.addEventListener("click", function () {
      setLang(btn.getAttribute("data-lang"));
      if (btn.classList.contains("lang-dialog-option")) closeLangDialog();
    });
  });
  updateLangMenuUI();
}

function updateSearchShareUI() {
  var su = SEARCH_UI[currentLang] || SEARCH_UI.vi;
  if (searchOpenBtn) {
    searchOpenBtn.setAttribute("aria-label", su.open);
    searchOpenBtn.setAttribute("title", su.open);
  }
  if (searchTitleEl) searchTitleEl.textContent = su.title;
  if (searchInput) searchInput.placeholder = su.placeholder;
  if (searchCloseBtn) searchCloseBtn.setAttribute("aria-label", READ_UI[currentLang].dismiss || "Đóng");
  document.querySelectorAll(".principle-header .share-link-btn").forEach(function (btn) {
    var sid = btn.getAttribute("data-share-section");
    var label = shareAriaForSection(sid);
    btn.setAttribute("aria-label", label);
    btn.setAttribute("title", label);
  });
  syncBookmarkUI();
  if (searchDialog && searchDialog.open && searchInput) {
    renderSearchResults(searchInput.value);
  }
}

function principleNumFromId(sectionId) {
  var m = /^p(\d+)$/.exec(sectionId || "");
  return m ? parseInt(m[1], 10) : 0;
}

function readJsonStore(key) {
  try {
    var raw = localStorage.getItem(key);
    if (!raw) return {};
    var data = JSON.parse(raw);
    return data && typeof data === "object" ? data : {};
  } catch (e) {
    return {};
  }
}

function writeJsonStore(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) {}
}

function getBookmarks() {
  var data = readJsonStore(BOOKMARK_KEY);
  var list = data.ids;
  return Array.isArray(list) ? list.filter(function (id) { return /^p\d+$/.test(id); }) : [];
}

function setBookmarks(ids) {
  writeJsonStore(BOOKMARK_KEY, { ids: ids, at: Date.now() });
}

function isBookmarked(sectionId) {
  return getBookmarks().indexOf(sectionId) !== -1;
}

function toggleBookmark(sectionId) {
  var ids = getBookmarks();
  var idx = ids.indexOf(sectionId);
  if (idx === -1) ids.push(sectionId);
  else ids.splice(idx, 1);
  ids.sort(function (a, b) {
    return principleNumFromId(a) - principleNumFromId(b);
  });
  setBookmarks(ids);
  syncBookmarkUI();
}

function principleTitleFor(sectionId) {
  var cls = langOnlyClass();
  var section = document.getElementById(sectionId);
  if (!section) return "";
  var titleEl = section.querySelector(".principle-header .principle-title." + cls);
  return titleEl ? titleEl.textContent.replace(/\s+/g, " ").trim() : "";
}

function bookmarkLabel(sectionId, saved) {
  var ui = BOOKMARK_UI[currentLang] || BOOKMARK_UI.vi;
  var n = principleNumFromId(sectionId);
  var tpl = saved ? ui.remove : ui.add;
  return tpl.replace("{n}", String(n));
}

function syncBookmarkUI() {
  var ids = getBookmarks();
  if (bookmarksOpenBtn) {
    bookmarksOpenBtn.classList.toggle("is-active", ids.length > 0);
    var ui = BOOKMARK_UI[currentLang] || BOOKMARK_UI.vi;
    bookmarksOpenBtn.setAttribute("aria-label", ui.open);
    bookmarksOpenBtn.setAttribute("title", ui.open);
  }
  document.querySelectorAll(".bookmark-btn").forEach(function (btn) {
    var sid = btn.getAttribute("data-bookmark-section");
    var saved = isBookmarked(sid);
    btn.classList.toggle("is-saved", saved);
    btn.setAttribute("aria-label", bookmarkLabel(sid, saved));
    btn.setAttribute("title", bookmarkLabel(sid, saved));
    btn.setAttribute("aria-pressed", String(saved));
  });
  document.querySelectorAll(".toc-list a[href^='#p']").forEach(function (link) {
    var sid = (link.getAttribute("href") || "").replace("#", "");
    link.classList.toggle("is-bookmarked", isBookmarked(sid));
  });
  renderBookmarksList();
}

function renderBookmarksList() {
  if (!bookmarksList || !bookmarksHint) return;
  var ui = BOOKMARK_UI[currentLang] || BOOKMARK_UI.vi;
  if (bookmarksTitleEl) bookmarksTitleEl.textContent = ui.title;
  bookmarksHint.textContent = ui.hint;
  bookmarksList.innerHTML = "";
  var ids = getBookmarks();
  if (!ids.length) {
    var empty = document.createElement("p");
    empty.className = "bookmarks-empty";
    empty.textContent = ui.empty;
    bookmarksList.appendChild(empty);
    return;
  }
  ids.forEach(function (sectionId) {
    var n = principleNumFromId(sectionId);
    var li = document.createElement("li");
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "bookmark-item-btn";
    btn.setAttribute("data-goto", sectionId);
    btn.setAttribute("aria-label", ui.goto.replace("{n}", String(n)));
    var num = document.createElement("span");
    num.className = "bookmark-item-num";
    num.textContent = String(n);
    var wrap = document.createElement("span");
    var title = document.createElement("span");
    title.className = "bookmark-item-title";
    title.textContent = principleTitleFor(sectionId) || ui.article.replace("{n}", String(n));
    wrap.appendChild(title);
    btn.appendChild(num);
    btn.appendChild(wrap);
    li.appendChild(btn);
    bookmarksList.appendChild(li);
  });
}

function openBookmarks() {
  if (!bookmarksDialog) return;
  syncBookmarkUI();
  if (typeof bookmarksDialog.showModal === "function") bookmarksDialog.showModal();
  else bookmarksDialog.setAttribute("open", "");
}

function closeBookmarks() {
  if (!bookmarksDialog) return;
  if (typeof bookmarksDialog.close === "function") bookmarksDialog.close();
  else bookmarksDialog.removeAttribute("open");
}

function initBookmarks() {
  if (bookmarksOpenBtn) bookmarksOpenBtn.addEventListener("click", openBookmarks);
  if (bookmarksCloseBtn) bookmarksCloseBtn.addEventListener("click", closeBookmarks);
  if (bookmarksDialog) {
    bookmarksDialog.addEventListener("click", function (e) {
      if (e.target === bookmarksDialog) closeBookmarks();
    });
  }
  if (bookmarksList && !bookmarksList._clickBound) {
    bookmarksList._clickBound = true;
    bookmarksList.addEventListener("click", function (e) {
      var btn = e.target.closest(".bookmark-item-btn");
      if (!btn) return;
      var sid = btn.getAttribute("data-goto");
      closeBookmarks();
      if (sid) {
        var el = document.getElementById(sid);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        try {
          var url = new URL(window.location.href);
          url.hash = sid;
          history.replaceState(null, "", url.pathname + url.search + url.hash);
        } catch (err) {}
      }
    });
  }
  document.addEventListener("click", function (e) {
    var btn = e.target.closest(".bookmark-btn");
    if (!btn) return;
    e.stopPropagation();
    toggleBookmark(btn.getAttribute("data-bookmark-section"));
  });
  syncBookmarkUI();
}

function initShareButtons() {
  document.querySelectorAll(".principle-header").forEach(function (header) {
    var section = header.closest("section[id]");
    if (!section || !section.id) return;
    var actions = header.querySelector(".principle-header-actions");
    if (!actions) {
      actions = document.createElement("div");
      actions.className = "principle-header-actions";
      header.appendChild(actions);
    }
    if (!actions.querySelector(".bookmark-btn")) {
      var bookmarkBtn = document.createElement("button");
      bookmarkBtn.type = "button";
      bookmarkBtn.className = "bookmark-btn";
      bookmarkBtn.setAttribute("data-bookmark-section", section.id);
      bookmarkBtn.setAttribute("aria-pressed", "false");
      appendBookmarkIcons(bookmarkBtn);
      actions.appendChild(bookmarkBtn);
    }
    if (!actions.querySelector(".share-link-btn")) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "share-link-btn";
      btn.setAttribute("data-share-section", section.id);
      appendCopyIcon(btn);
      actions.appendChild(btn);
    }
  });
}

function moduleStopSelector() {
  return ".label, .sayings, .principle-note, h2";
}

function wrapContentModulesInBlock(block) {
  if (!block || block._modulesWrapped) return;
  var stops = moduleStopSelector();
  var nodes = Array.prototype.slice.call(block.children);
  var i = 0;
  while (i < nodes.length) {
    var node = nodes[i];
    if (node.matches(stops)) {
      if (node.classList.contains("principle-note")) {
        i++;
        continue;
      }
      var module = document.createElement("div");
      module.className = "content-module";
      block.insertBefore(module, node);
      module.appendChild(node);
      i++;
      while (i < nodes.length) {
        var next = nodes[i];
        if (next.matches(stops)) break;
        module.appendChild(next);
        i++;
      }
      continue;
    }
    if (node.tagName === "P" || node.classList.contains("intro-pillars")) {
      var solo = document.createElement("div");
      solo.className = "content-module";
      block.insertBefore(solo, node);
      solo.appendChild(node);
    }
    i++;
  }
  block._modulesWrapped = true;
}

function initContentModules() {
  var intro = document.getElementById("intro");
  if (intro) {
    LANGS.forEach(function (lang) {
      var block = intro.querySelector("div." + lang + "-only");
      wrapContentModulesInBlock(block);
    });
  }
  document.querySelectorAll("section[id^='p']").forEach(function (section) {
    LANGS.forEach(function (lang) {
      var block = section.querySelector("div." + lang + "-only");
      wrapContentModulesInBlock(block);
    });
  });
}

function initShareDelegation() {
  var main = document.querySelector("main");
  if (!main || main._shareDelegation) return;
  main._shareDelegation = true;
  main.addEventListener("click", function (e) {
    var btn = e.target.closest(".share-link-btn");
    if (!btn) return;
    e.stopPropagation();
    copySectionContent(btn.getAttribute("data-share-section"), btn);
  });
}

function initSearch() {
  if (!searchDialog || !searchInput) return;
  if (searchOpenBtn) {
    searchOpenBtn.addEventListener("click", openSearch);
  }
  if (searchCloseBtn) {
    searchCloseBtn.addEventListener("click", closeSearch);
  }
  searchDialog.addEventListener("click", function (e) {
    if (e.target === searchDialog) closeSearch();
  });
  searchDialog.addEventListener("close", function () {
    searchPickIndex = -1;
  });
  if (searchResults && !searchResults._clickBound) {
    searchResults._clickBound = true;
    searchResults.addEventListener("click", function (e) {
      var btn = e.target.closest(".search-result-btn");
      if (!btn) return;
      var hits = searchResults._hits || [];
      var idx = parseInt(btn.dataset.index, 10);
      if (!isNaN(idx) && hits[idx]) gotoSearchResult(hits[idx]);
    });
  }
          searchInput.addEventListener("input", function () {
    if (searchDebounce) clearTimeout(searchDebounce);
    searchDebounce = setTimeout(function () {
      renderSearchResults(searchInput.value);
    }, 180);
  });
  searchInput.addEventListener("keydown", function (e) {
    var hits = searchResults._hits || [];
    var buttons = searchResults.querySelectorAll(".search-result-btn");
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!buttons.length) return;
      var next = searchPickIndex + 1;
      if (next >= buttons.length) next = 0;
      setSearchPick(next);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!buttons.length) return;
      var prev = searchPickIndex - 1;
      if (prev < 0) prev = buttons.length - 1;
      setSearchPick(prev);
    } else if (e.key === "Enter") {
      if (searchPickIndex >= 0 && hits[searchPickIndex]) {
        e.preventDefault();
        gotoSearchResult(hits[searchPickIndex]);
      } else if (hits[0]) {
        e.preventDefault();
        gotoSearchResult(hits[0]);
      }
    } else if (e.key === "Escape") {
      closeSearch();
    }
  });
  document.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (searchDialog.open) closeSearch();
      else openSearch();
    }
  });
}

function htmlLang(code) {
  if (code === "zh") return "zh-Hans";
  return code;
}

var THEME_KEY = "handbook-theme";
var themeBtn = document.getElementById("theme-toggle");
var themeMeta = document.querySelector('meta[name="theme-color"]');
var currentLang = DEFAULT_LANG;

function getTheme() {
  return document.documentElement.classList.contains("theme-dark") ? "dark" : "light";
}

function updateThemeToggleLabel() {
  if (!themeBtn) return;
  var theme = getTheme();
  var labels = THEME_LABELS[currentLang] || THEME_LABELS.vi;
  var label = theme === "dark" ? labels.dark : labels.light;
  themeBtn.setAttribute("aria-label", label);
  themeBtn.setAttribute("title", label);
}

function setTheme(theme) {
  if (theme !== "light" && theme !== "dark") theme = "light";
  var root = document.documentElement;
  root.classList.remove("theme-light", "theme-dark");
  root.classList.add("theme-" + theme);
  root.setAttribute("data-theme", theme);
  if (themeMeta) themeMeta.setAttribute("content", THEME_COLORS[theme]);
  try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
  updateThemeToggleLabel();
}

function readStore() {
  try {
    var raw = localStorage.getItem(READ_KEY);
    if (!raw) return {};
    var data = JSON.parse(raw);
    return data && typeof data === "object" ? data : {};
  } catch (e) {
    return {};
  }
}

function writeReadStore(data) {
  try { localStorage.setItem(READ_KEY, JSON.stringify(data)); } catch (e) {}
}

function getHeaderOffset() {
  var header = document.querySelector(".site-header");
  if (header) return header.getBoundingClientRect().height;
  var v = getComputedStyle(document.documentElement).getPropertyValue("--header-h").trim();
  var n = parseFloat(v);
  return isNaN(n) ? 56 : n * (v.indexOf("rem") !== -1 ? 16 : 1);
}

function getActiveSectionId() {
  var nodes = document.querySelectorAll("main section[id], main footer[id]");
  var probe = window.scrollY + getHeaderOffset() + 24;
  var active = null;
  nodes.forEach(function (el) {
    if (el.offsetTop <= probe) active = el.id;
  });
  return active;
}

function sectionResumeLabel(id) {
  var ui = READ_UI[currentLang] || READ_UI.vi;
  if (!id) return ui.continue;
  if (id === "intro") return ui.intro;
  if (id === "closing") return ui.closing;
  var m = /^p(\d+)$/.exec(id);
  if (m) return ui.principle.replace("{n}", m[1]);
  return ui.continue;
}

function saveReadPosition() {
  if (window.scrollY < READ_MIN_Y) {
    var data = readStore();
    if (data[currentLang]) {
      delete data[currentLang];
      writeReadStore(data);
    }
    hideReadResume();
    return;
  }
  var store = readStore();
  store[currentLang] = {
    y: Math.round(window.scrollY),
    id: getActiveSectionId(),
    at: Date.now()
  };
  writeReadStore(store);
}

function scheduleSaveRead() {
  if (readSaveTimer) clearTimeout(readSaveTimer);
  readSaveTimer = setTimeout(saveReadPosition, 450);
}

function getSavedRead(lang) {
  var entry = readStore()[lang];
  if (!entry || typeof entry.y !== "number" || entry.y < READ_MIN_Y) return null;
  return entry;
}

function scrollToSaved(entry, smooth) {
  if (!entry) return;
  var behavior = smooth ? "smooth" : "auto";
  if (entry.id) {
    var el = document.getElementById(entry.id);
    if (el) {
      el.scrollIntoView({ block: "start", behavior: behavior });
      return;
    }
  }
  window.scrollTo({ top: entry.y, left: 0, behavior: behavior });
}

function hideReadResume() {
  if (!readResumeWrap) return;
  readResumeWrap.classList.remove("visible");
  readResumeWrap.hidden = true;
  if (readResumeHideTimer) {
    clearTimeout(readResumeHideTimer);
    readResumeHideTimer = null;
  }
}

function showReadResume(entry) {
  if (!readResumeWrap || !readResumeBtn || !entry) return;
  var label = sectionResumeLabel(entry.id);
  var ui = READ_UI[currentLang] || READ_UI.vi;
  if (readResumeText) readResumeText.textContent = label;
  readResumeBtn.setAttribute("aria-label", label);
  if (readResumeDismiss) {
    readResumeDismiss.setAttribute("aria-label", ui.dismiss || "Đóng");
  }
  readResumeWrap.hidden = false;
  requestAnimationFrame(function () {
    readResumeWrap.classList.add("visible");
  });
  if (readResumeHideTimer) clearTimeout(readResumeHideTimer);
  readResumeHideTimer = setTimeout(hideReadResume, 14000);
}

function maybeOfferResume(fromLangSwitch) {
  if (location.hash) {
    hideReadResume();
    return;
  }
  var entry = getSavedRead(currentLang);
  if (!entry) {
    hideReadResume();
    return;
  }
  if (fromLangSwitch) {
    scrollToSaved(entry, false);
    hideReadResume();
    return;
  }
  if (window.scrollY >= READ_MIN_Y) {
    hideReadResume();
    return;
  }
  showReadResume(entry);
}

function setLang(lang) {
  if (LANGS.indexOf(lang) === -1) lang = DEFAULT_LANG;
  var prevLang = currentLang;
  currentLang = lang;
  LANGS.forEach(function (l) { body.classList.remove("lang-" + l); });
  body.classList.add("lang-" + lang);
  document.documentElement.lang = htmlLang(lang);
  allLangButtons().forEach(function (btn) {
    btn.setAttribute("aria-pressed", String(btn.getAttribute("data-lang") === lang));
  });
  try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  syncUrlLang(lang);
  updateThemeToggleLabel();
  updateLangMenuUI();
  updateSearchShareUI();
  syncBookmarkUI();
  rebuildSearchIndex(false);
  if (readInitDone && prevLang !== lang && !location.hash) {
    window.requestAnimationFrame(function () {
      maybeOfferResume(true);
    });
  }
}

var saved = null;
var urlLang = null;
try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
try {
  var qp = new URLSearchParams(window.location.search).get("lang");
  if (qp && LANGS.indexOf(qp) !== -1) urlLang = qp;
} catch (e) {}
if (urlLang) setLang(urlLang);
else if (saved && LANGS.indexOf(saved) !== -1) setLang(saved);
else setLang(DEFAULT_LANG);

initShareButtons();
initShareDelegation();
initBookmarks();
initContentModules();
initLangMenu();
initPageLayout();
initSearch();
updateSearchShareUI();
syncTocSpy();
rebuildSearchIndex(false);

if (!themeMeta) {
  themeMeta = document.createElement("meta");
  themeMeta.setAttribute("name", "theme-color");
  document.head.appendChild(themeMeta);
}
themeMeta.setAttribute("content", THEME_COLORS[getTheme()]);
updateThemeToggleLabel();

if (themeBtn) {
  themeBtn.addEventListener("click", function () {
    setTheme(getTheme() === "dark" ? "light" : "dark");
  });
}

function onWindowScroll() {
  scheduleSaveRead();
  syncTocSpy();
  if (backTop) backTop.classList.toggle("visible", window.scrollY > 400);
}
window.addEventListener("scroll", onWindowScroll, { passive: true });
window.addEventListener("pagehide", saveReadPosition);
document.addEventListener("visibilitychange", function () {
  if (document.visibilityState === "hidden") saveReadPosition();
});

if (readResumeBtn) {
  readResumeBtn.addEventListener("click", function () {
    var entry = getSavedRead(currentLang);
    if (entry) scrollToSaved(entry, true);
    hideReadResume();
  });
}
if (readResumeDismiss) {
  readResumeDismiss.addEventListener("click", function () {
    hideReadResume();
  });
}

window.addEventListener("load", function () {
  readInitDone = true;
  syncTocSpy();
  maybeOfferResume(false);
});

(function initIcons() {
  var SPRITE = "assets/sprites.svg";
  var PILLAR_ICONS = ["icon-teach", "icon-practice", "icon-say"];
  var LABEL_ICONS = ["icon-teach", "icon-practice", "icon-say"];

  var VIEWBOX = {
    "icon-lotus-lg": "0 0 64 72",
    "icon-teach": "0 0 48 48", "icon-practice": "0 0 48 48", "icon-say": "0 0 48 48",
    "deco-lotus-sm": "0 0 24 24",
    "deco-blossom": "0 0 24 24",
    "icon-search": "0 0 24 24",
    "icon-moon": "0 0 24 24",
    "icon-sun": "0 0 24 24"
  };

  function svgUse(id, className) {
    var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "icon " + className);
    svg.setAttribute("aria-hidden", "true");
    if (VIEWBOX[id]) svg.setAttribute("viewBox", VIEWBOX[id]);
    var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", SPRITE + "#" + id);
    svg.appendChild(use);
    return svg;
  }

  document.querySelectorAll(".cover-art").forEach(function (slot) {
    if (slot.firstChild) return;
    var lotus = svgUse("icon-lotus-lg", "cover-art");
    lotus.classList.remove("icon");
    lotus.classList.add("cover-art");
    slot.appendChild(lotus);
  });

  var brand = document.querySelector(".site-brand");
  if (brand && !brand.querySelector(".icon-brand")) {
    brand.insertBefore(svgUse("deco-lotus-sm", "icon-brand"), brand.firstChild);
  }

  appendBookmarkIcons(document.getElementById("bookmarks-open-btn"));
  document.querySelectorAll(".bookmark-btn").forEach(appendBookmarkIcons);
  document.querySelectorAll(".share-link-btn").forEach(appendCopyIcon);

  var searchBtn = document.getElementById("search-open-btn");
  if (searchBtn && !searchBtn.querySelector(".icon-header")) {
    searchBtn.appendChild(svgUse("icon-search", "icon-header"));
  }

  var themeToggleBtn = document.getElementById("theme-toggle");
  if (themeToggleBtn && !themeToggleBtn.querySelector(".icon-header")) {
    themeToggleBtn.appendChild(svgUse("icon-moon", "icon-header theme-icon theme-icon-moon"));
    themeToggleBtn.appendChild(svgUse("icon-sun", "icon-header theme-icon theme-icon-sun"));
  }

  document.querySelectorAll(".toc-head").forEach(function (head) {
    if (head.querySelector(".toc-head-inner")) return;
    var h2 = head.querySelector("h2");
    var sub = head.querySelector(".toc-sub");
    if (!h2) return;
    var wrap = document.createElement("div");
    wrap.className = "toc-head-inner";
    wrap.appendChild(h2);
    if (sub) wrap.appendChild(sub);
    head.innerHTML = "";
    head.appendChild(wrap);
  });

  document.querySelectorAll(".principle-note").forEach(function (note) {
    if (note.querySelector(".principle-note-body") && !note.querySelector("blockquote")) {
      note.classList.add("principle-note--stories");
    }
    if (note.querySelector(".principle-note-head")) return;
    var kicker = note.querySelector(".principle-note-kicker");
    if (!kicker) return;
    var head = document.createElement("div");
    head.className = "principle-note-head";
    head.appendChild(svgUse("deco-blossom", "icon-note-blossom"));
    head.appendChild(kicker);
    note.insertBefore(head, note.firstChild);
  });

  document.querySelectorAll(".intro-pillars").forEach(function (box) {
    box.querySelectorAll(".pillar").forEach(function (pillar, i) {
      if (pillar.querySelector(".icon-pillar")) return;
      var iconId = PILLAR_ICONS[Math.min(i, PILLAR_ICONS.length - 1)];
      pillar.insertBefore(svgUse(iconId, "icon-pillar"), pillar.firstChild);
    });
  });

  document.querySelectorAll("section[id^='p']").forEach(function (sec) {
    sec.querySelectorAll(".label").forEach(function (label, i) {
      if (label.querySelector(".icon-label")) return;
      var iconId = LABEL_ICONS[Math.min(i, LABEL_ICONS.length - 1)];
      label.insertBefore(svgUse(iconId, "icon-label"), label.firstChild);
    });
  });
})();

document.querySelectorAll("#intro, .toc, .closing").forEach(function (el) {
  el.classList.add("is-visible");
});
if ("IntersectionObserver" in window) {
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible");
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.06, rootMargin: "0px 0px -30px 0px" });
  document.querySelectorAll("section[id^='p']").forEach(function (el) {
    obs.observe(el);
  });
} else {
  document.querySelectorAll("section[id^='p']").forEach(function (el) {
    el.classList.add("is-visible");
  });
}

var backTop = document.getElementById("back-top");
if (backTop) {
  /* scroll: see onWindowScroll */
  backTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
})();
