const STORAGE_KEY = 'match-de-intereses-decisions';

function readDecisions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

export function createMatchStore() {
  let decisions = readDecisions();

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(decisions));
    } catch {
      // La aplicación continúa funcionando aunque el almacenamiento esté bloqueado.
    }
  }

  return {
    saveDecision(profile, decision) {
      decisions[profile.name] = { profile, decision };
      persist();
    },

    removeDecision(profileName) {
      delete decisions[profileName];
      persist();
    },

    getMatches() {
      return Object.values(decisions)
        .filter(({ decision }) => decision === 'like' || decision === 'super-like')
        .map(({ profile, decision }) => ({ ...profile, matchType: decision }));
    },

    clearDecisions() {
      decisions = {};
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // No interrumpir la interacción si el almacenamiento está bloqueado.
      }
    }
  };
}
