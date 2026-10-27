export function createProfileStore(profileList) {
  let currentIndex = 0;
  let profiles = profileList;
  const history = [];

  return {
    getCurrentProfile() {
      return profiles[currentIndex];
    },

    nextProfile() {
      if (profiles.length === 0) return;
      history.push(currentIndex);
      currentIndex = (currentIndex + 1) % profiles.length;
    },

    previousProfile() {
      const previousIndex = history.pop();
      if (previousIndex === undefined) return false;
      currentIndex = previousIndex;
      return true;
    },

    setProfiles(nextProfiles) {
      profiles = nextProfiles;
      currentIndex = 0;
    }
  };
}
