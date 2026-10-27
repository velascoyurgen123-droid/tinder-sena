export function renderUserProfile(container, profile) {
  if (!profile) {
    container.innerHTML = '<p class="profile-preview__empty">Completa el formulario para ver tu perfil.</p>';
    return;
  }

  container.innerHTML = `
    <article class="profile-preview__card">
      <img src="${profile.image}" alt="Perfil de ${profile.name}" onerror="this.src='assets/images/perfil-default.svg'; this.onerror=null;">
      <div>
        <p class="profile-card__tag">${profile.category}</p>
        <h3>${profile.name}, ${profile.age}</h3>
        <p>${profile.city}</p>
        <p>${profile.description}</p>
        <div class="profile-card__interests">
          ${profile.interests.map((interest) => `<span>${interest}</span>`).join('')}
        </div>
      </div>
    </article>
  `;
}
