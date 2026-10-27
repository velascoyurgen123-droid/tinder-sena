export function renderProfile(container, profile) {
  if (!profile) {
    container.innerHTML = '<p>No hay perfiles disponibles.</p>';
    return;
  }

  container.innerHTML = `
    <img class="profile-card__image" src="${profile.image}" alt="${profile.name}" onerror="this.src='assets/images/perfil-default.svg'; this.onerror=null;">
    <div class="profile-card__identity">
      <div>
        <p class="profile-card__tag">${profile.category}</p>
        <h3>${profile.name}, ${profile.age}</h3>
      </div>
      <p class="profile-card__city">${profile.city}</p>
    </div>
    <p class="profile-card__description">${profile.description}</p>
    <div class="profile-card__interests" aria-label="Intereses">
      ${profile.interests.map((interest) => `<span>${interest}</span>`).join('')}
    </div>
  `;
}
