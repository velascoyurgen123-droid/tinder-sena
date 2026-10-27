import { profiles } from './data/profiles.js';
import { createProfileStore } from './state/profileStore.js';
import { createMatchStore } from './state/matchStore.js';
import { createUserProfileStore } from './state/userProfileStore.js';
import { createChatStore } from './state/chatStore.js';
import { renderProfile } from './components/profileCard.js';
import { renderMatches } from './components/matchList.js';
import { renderUserProfile } from './components/userProfile.js';
import { renderChat } from './components/chat.js';
import { enableSwipeInteraction } from './interactions/swipeInteraction.js';

const VIEW_NAMES = ['discover', 'explore', 'likes', 'matches', 'messages', 'profile', 'settings'];
const elements = selectElements();
const views = [...document.querySelectorAll('[data-view]')];
const stores = {
  profiles: createProfileStore(profiles),
  matches: createMatchStore(),
  userProfile: createUserProfileStore(),
  chats: createChatStore()
};
let activeChat = null;

function selectElements() {
  const ids = [
    'profile-card', 'feedback', 'pass-button', 'rewind-button', 'super-like-button',
    'like-button', 'boost-button', 'report-button', 'block-button', 'matches-list',
    'clear-data-button', 'profile-form', 'profile-form-feedback', 'my-profile-preview',
    'chat', 'chat-title', 'chat-messages', 'chat-form', 'explore-list', 'reset-app-button'
  ];
  return Object.fromEntries(ids.map((id) => [toCamelCase(id), document.querySelector(`#${id}`)]));
}

function toCamelCase(value) {
  return value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

function renderCurrentProfile() {
  renderProfile(elements.profileCard, stores.profiles.getCurrentProfile());
}

function renderMatchList() {
  renderMatches(elements.matchesList, stores.matches.getMatches());
}

function renderExplore() {
  const interests = [...new Set(profiles.flatMap(({ interests: items }) => items))];
  elements.exploreList.innerHTML = interests.map((interest) => `<button type="button">${interest}</button>`).join('');
}

function renderSavedUserProfile() {
  const profile = stores.userProfile.getProfile();
  renderUserProfile(elements.myProfilePreview, profile);
  if (!profile) return;

  Object.entries(profile).forEach(([field, value]) => {
    const input = elements.profileForm.elements[field];
    if (input) input.value = Array.isArray(value) ? value.join(', ') : value;
  });
}

function showView(viewName) {
  const activeView = VIEW_NAMES.includes(viewName) ? viewName : 'discover';
  views.forEach((view) => { view.hidden = view.dataset.view !== activeView; });

  if (activeView === 'messages' && !activeChat) {
    elements.chatTitle.textContent = 'Mensajes';
    renderChat(elements.chatMessages, []);
  }
}

function navigateFromHash() {
  showView(window.location.hash.slice(1));
}

function advanceProfile(decision, message) {
  const profile = stores.profiles.getCurrentProfile();
  if (!profile) return;

  stores.matches.saveDecision(profile, decision);
  elements.feedback.textContent = message;
  stores.profiles.nextProfile();
  renderCurrentProfile();
  renderMatchList();
}

function rewindProfile() {
  if (!stores.profiles.previousProfile()) {
    elements.feedback.textContent = 'No hay una decisión anterior para deshacer.';
    return;
  }

  stores.matches.removeDecision(stores.profiles.getCurrentProfile().name);
  elements.feedback.textContent = 'Última decisión deshecha.';
  renderCurrentProfile();
  renderMatchList();
}

function activateBoost() {
  if (!stores.profiles.getCurrentProfile()) return;
  elements.feedback.textContent = '⚡ Boost activado para este perfil.';
  elements.boostButton.classList.add('is-active');
  window.setTimeout(() => elements.boostButton.classList.remove('is-active'), 900);
}

function openChat(profile) {
  activeChat = profile;
  elements.chatTitle.textContent = `Chat con ${profile.name}`;
  renderChat(elements.chatMessages, stores.chats.getMessages(profile.name));
  window.location.hash = 'messages';
}

function handleProfileFormSubmit(event) {
  event.preventDefault();
  const data = new FormData(elements.profileForm);
  const profile = {
    name: data.get('name').trim(), age: Number(data.get('age')), city: data.get('city').trim(),
    category: data.get('category').trim(), description: data.get('description').trim(),
    interests: data.get('interests').split(',').map((item) => item.trim()).filter(Boolean),
    image: data.get('image').trim() || 'assets/images/perfil-default.svg'
  };

  if (!profile.interests.length) {
    elements.profileFormFeedback.textContent = 'Agrega al menos un interés.';
    return;
  }

  stores.userProfile.saveProfile(profile);
  renderUserProfile(elements.myProfilePreview, profile);
  elements.profileFormFeedback.textContent = 'Perfil guardado correctamente.';
}

function handleChatSubmit(event) {
  event.preventDefault();
  if (!activeChat) return;

  const message = new FormData(elements.chatForm).get('message').trim();
  if (!message) return;
  stores.chats.addMessage(activeChat.name, message);
  elements.chatForm.reset();
  renderChat(elements.chatMessages, stores.chats.getMessages(activeChat.name));
}

function bindEvents() {
  elements.passButton.addEventListener('click', () => advanceProfile('pass', 'Perfil pasado.'));
  elements.likeButton.addEventListener('click', () => advanceProfile('like', '¡Match de intereses!'));
  elements.superLikeButton.addEventListener('click', () => advanceProfile('super-like', '¡Super like enviado!'));
  elements.rewindButton.addEventListener('click', rewindProfile);
  elements.boostButton.addEventListener('click', activateBoost);
  elements.reportButton.addEventListener('click', () => advanceProfile('report', 'Perfil reportado.'));
  elements.blockButton.addEventListener('click', () => advanceProfile('block', 'Perfil bloqueado.'));
  elements.clearDataButton.addEventListener('click', () => {
    stores.matches.clearDecisions();
    elements.feedback.textContent = 'Decisiones limpiadas.';
    renderMatchList();
  });
  elements.matchesList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-match-name]');
    if (!button) return;
    const match = stores.matches.getMatches().find(({ name }) => name === button.dataset.matchName);
    if (match) openChat(match);
  });
  elements.profileForm.addEventListener('submit', handleProfileFormSubmit);
  elements.chatForm.addEventListener('submit', handleChatSubmit);
  elements.resetAppButton.addEventListener('click', () => { localStorage.clear(); window.location.reload(); });
  window.addEventListener('hashchange', navigateFromHash);
  enableSwipeInteraction(elements.profileCard, (direction) => {
    const isLike = direction === 'right';
    advanceProfile(isLike ? 'like' : 'pass', isLike ? '¡Match de intereses!' : 'Perfil pasado.');
  });
}

function initialize() {
  renderCurrentProfile();
  renderMatchList();
  renderExplore();
  renderSavedUserProfile();
  bindEvents();
  navigateFromHash();
}

initialize();
