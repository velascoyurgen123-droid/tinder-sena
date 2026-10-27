export function renderMatches(container, matches) {
  if (matches.length === 0) {
    container.innerHTML = '<p class="matches-list__empty">Todavía no tienes matches. Explora los perfiles para encontrar intereses en común.</p>';
    return;
  }

  container.innerHTML = matches.map((profile) => `
    <article class="match-card">
      <img src="${profile.image}" alt="${profile.name}" onerror="this.src='assets/images/perfil-default.svg'; this.onerror=null;">
      <div>
        <h3>${profile.name}, ${profile.age}</h3>
        <p>${profile.city} · ${profile.category}${profile.matchType === 'super-like' ? ' · ★ Super like' : ''}</p>
      </div>
      <button class="open-chat-button" type="button" data-match-name="${profile.name}">Chatear</button>
    </article>
  `).join('');
}
