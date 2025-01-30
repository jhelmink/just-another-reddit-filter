const newKeywordForm = document.forms["keywordForm"];
const newKeyWordInput = document.getElementById("newKeyWord");
const savedKeyWordsList = document.getElementById("savedKeyWords");

newKeywordForm.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent page reload
  const newWord = newKeyWordInput.value.trim();
  if (newWord) {
    console.log(`Adding keyword: ${newWord}`);
    addKeywordToList(newWord); // Add to UI
    newKeyWordInput.value = ""; // clear the input field
  }
});

function addKeywordToList(word) {
    const li = document.createElement("li");
    li.innerHTML = `
        <span>${word}</span>
        <span class="delete-btn">x</span>
    `;
    savedKeyWordsList.appendChild(li);
    // sendMessage(word); // Add by default

    // Add event listener for the delete button
    li.querySelector(".delete-btn").addEventListener("click", () => {
        li.remove();
        // sendMessage(word, "remove");
    });
}

// send the input keyword to the content script using the message passing API
function sendMessageToContentScript(keyword, addOrRemove = "add") {
  const message = {
    keyword,
    addOrRemove,
  };

  // get the current tab and send the message to the content script
  const params = {
    active: true,
    currentWindow: true,
  };
  // https://developer.chrome.com/docs/extensions/reference/api/tabs#method-query
  chrome.tabs.query(params, sendMessageOnCurrentTab);

  // send the message to the content script
  function sendMessageOnCurrentTab(tab) {
    // https://developer.chrome.com/docs/extensions/reference/api/tabs#method-sendMessage
    chrome.tabs.sendMessage(tab[0].id, message);
  }
}
