/** Help */

/* prevent submit form */
var ready = (callback) => {
  if (document.readyState != "loading") callback();
  else document.addEventListener("DOMContentLoaded", callback);
}

ready(() => {
  document.addEventListener("keypress", (e) => {
    if (e.keyCode == 13) {
      e.preventDefault();
      createCard();
    }
  });
});

/* set theme of favicon */
matcher = window.matchMedia('(prefers-color-scheme: dark)');
matcher.addListener(onUpdate);
onUpdate();

function onUpdate() {
  const darkSchemeIcon = document.querySelector('link#dark-icon');
  const lightSchemeIcon = document.querySelector('link#light-icon');

  if (matcher.matches) {
    lightSchemeIcon.remove();
    document.head.append(darkSchemeIcon);
  } else {
    document.head.append(lightSchemeIcon);
    darkSchemeIcon.remove();
  }
}

/** App */
loadCards();
const cards = document.querySelectorAll('.card');
const dropzones = document.querySelectorAll('.dropzone');

/* drag and drop cards */
cards.forEach(card => {
  card.addEventListener('dragstart', dragstart);
  card.addEventListener('dragend', dragend);
});

function dragstart () {
  dropzones.forEach(dropzone => dropzone.classList.add('highlight'));

  this.classList.add('is-dragging');
}

function dragend () {
  dropzones.forEach(dropzone => dropzone.classList.remove('highlight'));

  this.classList.remove('is-dragging');
}

function loadCards() {
  let cardsSaved;
  if (localStorage.getItem('kanbanCards'))
    cardsSaved = JSON.parse(localStorage.getItem('kanbanCards'))
  else
    return;

  cardsSaved.forEach(card => createCards(card));
}

function saveCards() {
  const cardExisting = document.querySelectorAll('.card');
  const cardsToSave = [];

  cardExisting.forEach(card => {
    cardsToSave.push({
      id: card.id,
      cardText: card.getElementsByClassName('content')[0].textContent,
      position: card.parentNode.id
    });
  });

  localStorage.setItem('kanbanCards', JSON.stringify(cardsToSave))
}

function createCards({ id, cardText, position }) {
  const cardElement = document.createElement('div');
  cardElement.classList.add('card');
  cardElement.setAttribute('draggable', true);
  cardElement.setAttribute('id', id);

  const statusContainer = document.createElement('div');
  statusContainer.classList.add('statusContainer');

  const cardStatus = document.createElement('div');
  cardStatus.classList.add('status');

  const deleteCard = document.createElement('div');
  deleteCard.classList.add('deleteCard');

  const imgDelete = document.createElement('img');
  imgDelete.setAttribute('src', 'assets/delete.svg');
  imgDelete.setAttribute('alt', 'Delete card');
  imgDelete.setAttribute('onclick', `deleteCard('${id}')`);

  const cardTextElement = document.createElement('div');
  cardTextElement.classList.add('content');
  cardTextElement.textContent = cardText;

  statusContainer.appendChild(cardStatus);
  deleteCard.appendChild(imgDelete);
  statusContainer.appendChild(deleteCard);
  cardElement.appendChild(statusContainer);
  cardElement.appendChild(cardTextElement);
  cardElement.addEventListener('dragstart', dragstart);
  cardElement.addEventListener('dragend', dragend);

  document.getElementById(position).appendChild(cardElement);
}

/* dropzones */
dropzones.forEach(dropzone => {
  dropzone.addEventListener('dragover', dragover);
  dropzone.addEventListener('dragleave', dragleave);
  dropzone.addEventListener('drop', drop);
});

function dragover () {
  this.classList.add('over');

  const cardBeingDragged = document.querySelector('.is-dragging');

  this.appendChild(cardBeingDragged);
}

function dragleave () {
  this.classList.remove('over');
  saveCards();
}

function drop () {
  this.classList.remove('over');
}

/* create and delete cards */

function createCard() {
  const cardText = document.querySelector('.text-input').value;

  if (cardText !== "" ) {
    const card = {
      id: Math.random().toString(16).slice(2, 8),
      cardText: cardText,
      position: 'todo'
    }

    createCards(card);
    saveCards();
    clearInput();
  }
}

function clearInput() {
  document.querySelector('.text-input').value = "";
}

function deleteCard(id) {
  const deleteCard = document.getElementById(`${id}`).children[0].querySelector('.deleteCard');
  deleteCard.innerHTML = '';

  const imgCancelDelete = document.createElement('img');
  imgCancelDelete.setAttribute('src', 'assets/cancel.svg');
  imgCancelDelete.setAttribute('alt', 'Cancel delete card');
  imgCancelDelete.setAttribute('onclick', `cancelDelete('${id}')`);

  const imgConfirmDelete = document.createElement('img');
  imgConfirmDelete.setAttribute('src', 'assets/confirm.svg');
  imgConfirmDelete.setAttribute('alt', 'Confirm delete card');
  imgConfirmDelete.setAttribute('onclick', `confirmDelete('${id}')`);

  deleteCard.appendChild(imgCancelDelete);
  deleteCard.appendChild(imgConfirmDelete);
}

function cancelDelete(id) {
  const deleteCard = document.getElementById(`${id}`).children[0].querySelector('.deleteCard');

  deleteCard.innerHTML = '';

  const imgDelete = document.createElement('img');
  imgDelete.setAttribute('src', 'assets/delete.svg');
  imgDelete.setAttribute('alt', 'Delete card');
  imgDelete.setAttribute('onclick', `deleteCard('${id}')`);

  deleteCard.appendChild(imgDelete);
}

function confirmDelete(id) {
  document.getElementById(`${id}`).remove();
  saveCards();
}
