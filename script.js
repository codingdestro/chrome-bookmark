const container = document.querySelector(".container");
const input = document.querySelector(".add-input");

let Items = [];

function deleteBookmark(id) {
  chrome.storage.local.remove(id, () => console.log(`remove ${id}`));
  loadSites();
}

function createDeleteBtn(id) {
  const delete_btn = document.createElement("button");
  delete_btn.classList.add(".delete-btn");
  delete_btn.addEventListener("click", () => deleteBookmark(id));
  return delete_btn;
}

function createImage(src) {
  const image = document.createElement("img");
  image.src = src;
  image.classList.add("image");
  return image;
}

function createTitle(desc) {
  const title = document.createElement("p");
  title.innerText = desc;
  return title;
}

function createAnchor(id, url) {
  const span = document.createElement("span");
  return span;
}

function createElements(id,name, url, icon) {
  const span = createAnchor(id, url);
  const image = createImage(icon);
  span.appendChild(image);
  const title = createTitle(name);

  const li = document.createElement("li");
  li.addEventListener("contextmenu", (e) => {
    e.preventDefault()
    console.log(`id = ${id}`);
    Items = Items.filter((item,idx)=> idx != id)
    listItems()
  });

  li.addEventListener("click", () => {
    // If you want to open in new tab instead of current
    chrome.tabs.create({ url: url });
  });


  li.appendChild(span);
  li.appendChild(title);

  return li;
}

function saveThisSite(name) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    const favicoUrl = currentTab.favIconUrl;
    const siteUrl = currentTab.url;

    Items.push({
      title: name,
      url: siteUrl,
      icon: favicoUrl,
    });

    chrome.storage.local.set({ bookmarks: Items }, () => listItems());
  });
}

function loadSites() {
  chrome.storage.local.get(["bookmarks"], (items) => {
    Items = items.bookmarks;
    listItems();
  });
}

function listItems() {
  container.innerHTML = "";
  for (let i = 0; i < Items.length; i++) {
    const element = createElements(i,Items[i].title, Items[i].url, Items[i].icon);
    container.appendChild(element);
  }
}

input.focus();
input.addEventListener("keypress", (event) => {
  if (event.key == "Enter") {
    const value = input.value;
    if (!value) return;
    saveThisSite(value);
    input.value = "";
  }
});

loadSites();
