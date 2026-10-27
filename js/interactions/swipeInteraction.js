const SWIPE_THRESHOLD = 100;
const SWIPE_OUT_DISTANCE = 500;

export function enableSwipeInteraction(card, onSwipe) {
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let isDragging = false;

  function resetCard() {
    card.classList.remove('is-dragging');
    card.style.transform = '';
  }

  function finishSwipe(direction) {
    card.classList.remove('is-dragging');
    card.style.transform = `translateX(${direction === 'right' ? SWIPE_OUT_DISTANCE : -SWIPE_OUT_DISTANCE}px) rotate(${direction === 'right' ? 18 : -18}deg)`;

    window.setTimeout(() => {
      card.style.transform = '';
      onSwipe(direction);
    }, 220);
  }

  function handlePointerDown(event) {
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    startX = event.clientX;
    startY = event.clientY;
    currentX = 0;
    isDragging = true;
    card.classList.add('is-dragging');
    card.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event) {
    if (!isDragging) return;

    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;

    if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaX) < 12) return;

    currentX = deltaX;
    card.style.transform = `translateX(${deltaX}px) rotate(${deltaX / 18}deg)`;
  }

  function handlePointerUp(event) {
    if (!isDragging) return;

    isDragging = false;
    card.releasePointerCapture(event.pointerId);

    if (Math.abs(currentX) < SWIPE_THRESHOLD) {
      resetCard();
      return;
    }

    finishSwipe(currentX > 0 ? 'right' : 'left');
  }

  card.addEventListener('pointerdown', handlePointerDown);
  card.addEventListener('pointermove', handlePointerMove);
  card.addEventListener('pointerup', handlePointerUp);
  card.addEventListener('pointercancel', resetCard);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') finishSwipe('left');
    if (event.key === 'ArrowRight') finishSwipe('right');
  });
}
