const container = document.querySelector(".container");
const input = document.querySelector(".add-input");
function createElements(name, url, icon) {
  const link = document.createElement("a");
  link.target = "_blank";
  link.href = url;
  link.dataset.name = name;
  link.classList.add("link");

  const image = document.createElement("img");
  image.src = icon;
  image.classList.add("image");

  link.appendChild(image);

  return link;
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

document.querySelector(".add-btn").addEventListener("click", () => {
  const value = input.value;
  if (!value) return;
  saveThisSite(value);
  input.value = "";
});

// chrome.storage.local.clear();
loadSites();
