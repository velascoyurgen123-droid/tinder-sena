const STORAGE_KEY = 'match-de-intereses-chats';

function readChats() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

export function createChatStore() {
  let chats = readChats();

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
    } catch {
      // El chat sigue visible durante la sesión si el almacenamiento está bloqueado.
    }
  }

  return {
    getMessages(profileName) {
      return chats[profileName] || [];
    },

    addMessage(profileName, text) {
      if (!chats[profileName]) chats[profileName] = [];
      chats[profileName].push({ text, createdAt: new Date().toISOString() });
      persist();
    }
  };
}
