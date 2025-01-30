console.log("jarf script running");

// Load the list of keywords from storage
loadFromStorage();

// On scroll, run the filter function on the new posts
document.addEventListener("scroll", runFilter);

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(recieveMessageFromPopup);

// Once the DOM is loaded run the filter on the initial posts
window.addEventListener("DOMContentLoaded", (event) => {
  runFilter();
});

// Constants
const jarfStorageName = "jarf-keywords";

// Settings - could be changed in future
const settings = {
  articleElementName: "article",
  articleTitleTag: "aria-label",
  removePromoted: true,
  promotedElementName: "shrettid-ad-post",
};

const articles = document.getElementsByTagName(settings.articleElementName);
const promotedPosts = document.getElementsByTagName(
  settings.promotedElementName
);

let filteredWords = [];

// receieve a message with the keyword input by the user
const recieveMessageFromPopup = (message) => {
  const newWord = message.keyword;
  const addOrRemove = message.addOrRemove;
  if (addOrRemove === "add") {
    addKeywordToList(newWord);
  } else {
    removeWordFromList(newWord);
  }
  runFilter();
};

const addKeywordToList = (word) => {
  filteredWords.push(word);
  saveToStorage();
};

const removeWordFromList = (word) => {
  const index = filteredWords.indexOf(word);
  if (index > -1) {
    filteredWords.splice(index, 1);
    saveToStorage();
  }
};

// https://developer.chrome.com/docs/extensions/reference/api/storage/
const loadFromStorage = () => {
  let storageItem = localStorage.getItem(jarfStorageName);
  if (!storageItem) {
    // There was no storage item, so we will create one
    localStorage.setItem(jarfStorageName, JSON.stringify([]));
    storageItem = localStorage.getItem(jarfStorageName);
  }

  filterList = JSON.parse(storageItem);
  filteredWords = filterList;
};

const saveToStorage = () => {
  localStorage.setItem(jarfStorageName, JSON.stringify(filteredWords));
  // chrome.storage.sync.set({ options });
};

const filterPosts = (articles) => {
  articles.forEach((article) => {
    // Pull out the title of the post
    var title = article.getElementsByTagName(settings.articleTitleTag)[0]
      .innerText;
    for (let i = 0; i < filteredWords.length; i++) {
      let filteredWord = filteredWords[i];
      if (title.toLowerCase().includes(filteredWord)) {
        article.remove();
        break;
      }
    }
  });
};

const filterPromoted = (promotedPosts) => {
  promotedPosts.forEach((post) => {
    post.remove();
  });
};

// run the filter function on the current list of posts
function runFilter() {
  if (filteredWords.length == 0) return;
  filterPosts(Array.from(articles));
  if (settings.removePromoted) {
    filterPromoted(Array.from(promotedPosts));
  }
}
