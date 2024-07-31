const container = document.querySelector(".container");
const input = document.querySelector(".add-input");

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
  const link = document.createElement("a");
  link.target = "_blank";
  link.href = url;
  link.classList.add("link");
  return link;
}

function createElements(id, url, icon) {
  const link = createAnchor(id, url);
  const image = createImage(icon);
  link.appendChild(image);
  const title = createTitle(id);
  const deleteBtn = createDeleteBtn(id);

  const li = document.createElement("li");
  li.appendChild(link);
  li.appendChild(title);
  li.appendChild(deleteBtn);

  return li;
}

function saveThisSite(name) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    console.log(currentTab);
    const favicoUrl = currentTab.favIconUrl;
    const siteUrl = currentTab.url;

    chrome.storage.local.set({ [name]: [siteUrl, favicoUrl] }, () =>
      loadSites(),
    );
  });
}

function loadSites() {
  container.innerHTML = "";
  chrome.storage.local.get(null, (items) => {
    for (const [key, value] of Object.entries(items)) {
      const element = createElements(key, value[0], value[1]);
      container.appendChild(element);
    }
  });
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
