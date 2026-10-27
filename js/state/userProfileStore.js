const STORAGE_KEY = 'match-de-intereses-user-profile';

export function createUserProfileStore() {
  function getProfile() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch {
      return null;
    }
  }

  return {
    getProfile,
    saveProfile(profile) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      } catch {
        // La vista sigue disponible aunque el almacenamiento esté bloqueado.
      }
    }
  };
}
