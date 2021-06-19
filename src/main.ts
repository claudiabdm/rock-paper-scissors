import './styles/styles.scss';

// ------------ //
// LOAD         //
// ------------ //
document.addEventListener(
	'DOMContentLoaded',
	() => {
		initModal();
	},
	false
);

// ------------ //
// MODAL        //
// ------------ //
function initModal(): void {

  const main = document.querySelector('.main');
  const header = document.querySelector('.header');
  const modalToggleButton = document.getElementById('modalButton');
  const modal = document.getElementById('rulesModal');
  const modalCloseButton = document.getElementById('modalCloseButton');
  
  modalToggleButton?.addEventListener('click', modalButtonClickHandler, false);
  modalCloseButton?.addEventListener('click', modalButtonClickHandler, false);
  
  function modalButtonClickHandler(_event: Event) {
    const isOpen = Boolean(modal?.classList.contains('modal--open'));
		toggleModal(isOpen);
	}

	function toggleModal(isOpen: boolean) {
		if (isOpen) {
			modal?.setAttribute('aria-hidden', 'true');
			modal?.classList.remove('modal--open');

      main?.setAttribute('aria-hidden', 'false');
      header?.setAttribute('aria-hidden', 'false');

		} else {
			modal?.setAttribute('aria-hidden', 'false');
			modal?.classList.add('modal--open');

      main?.setAttribute('aria-hidden', 'true');
      header?.setAttribute('aria-hidden', 'true');

		}
	}
}
