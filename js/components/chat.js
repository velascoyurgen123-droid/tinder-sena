export function renderChat(container, messages) {
  if (messages.length === 0) {
    container.innerHTML = '<p class="chat-messages__empty">Inicia la conversación compartiendo un interés.</p>';
    return;
  }

  container.innerHTML = messages.map((message) => `
    <p class="chat-message">
      ${escapeHtml(message.text)}
      <time datetime="${message.createdAt}">${formatTime(message.createdAt)}</time>
    </p>
  `).join('');
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  })[character]);
}

function formatTime(dateString) {
  return new Intl.DateTimeFormat('es-CO', { hour: '2-digit', minute: '2-digit' }).format(new Date(dateString));
}
