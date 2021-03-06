function createTabListeners() {
  chrome.tabs.onCreated.addListener((tab) => {
    createdTab(tab);
  });
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    checkSecurityWebsites(tabId, changeInfo);
    checkScriptWebsites(tabId, changeInfo);
    updatedTab(tabId, changeInfo, tab);
  });
  chrome.tabs.onActivated.addListener((tabId, activeInfo, tab) => {
    activatedTab(tabId, activeInfo, tab);
  });
  chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    removedTab(tabId, removeInfo);
  });
}

function createdTab(tab) {
  socket.emit('Created Tab', tab);
}

function updatedTab(tabId, changeInfo, tab) {
  chrome.storage.local.get("userData", (userData) => {
    if (userData.email !== "No email") {
      socket.emit('Updated Tab', {
        tabId: tabId,
        changeInfo: changeInfo,
        tab: tab,
        userID: userData["userData"].email
      });
    } else {
      socket.emit('Updated Tab', {
        tabId: tabId,
        changeInfo: changeInfo,
        tab: tab,
        userID: userData["userData"].id
      });
    }
  });
}

function activatedTab(tabId, activeInfo, tab) {
  socket.emit('Activated Tab', {
    tabId: tabId,
    activeInfo: activeInfo,
    tab: tab
  });
}

function removedTab(tabId, removeInfo) {
  socket.emit('Removed Tab', {
    tabId: tabId,
    removeInfo: removeInfo
  });
}
