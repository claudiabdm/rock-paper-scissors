import './styles/styles.scss';

// ------------ //
// VARIABLES    //
// ------------ //
const options = ['paper', 'scissors', 'rock'];
const gameElem = document.querySelector('.game') as HTMLElement;
let score = 0;

// ------------ //
// LOAD         //
// ------------ //
document.addEventListener(
	'DOMContentLoaded',
	() => {
		if (gameElem) {
			initModal();
			initGame(gameElem);
		}
	},
	false
);

// ------------ //
// GAME         //
// ------------ //
function initGame(game: HTMLElement) {
	creatStartGameView(game);
	game.addEventListener('click', selectOptionClickHandler, false);
}


// --------------- //
// START GAME VIEW //
// --------------- //
function creatStartGameView(game: HTMLElement): void {
	clearGameOptions(game);
	options.forEach((option, idx) => {
		game.appendChild(createOptionElem(option, idx + 1, true));
	})
}

// --------------- //
// WAITING VIEW    //
// --------------- //
function createWaitingView(optionId: string, game: HTMLElement): void {
	clearGameOptions(game);
	game.classList.add('game--results');
	const playerOption = createOptionElem(optionId, 1, false);
	game.appendChild(playerOption);
	const houseOption = createOptionElem(options[Math.floor(Math.random()*options.length)], 2, false);
	const pickingOption = createEmptyOptionElem();
	game.appendChild(pickingOption);
	setTimeout(() => {
		game.removeChild(pickingOption);
		game.appendChild(houseOption);
		createResultView(playerOption, houseOption, game);
	}, 1000);
}

// --------------- //
// RESULT VIEW    //
// --------------- //
function createResultView(playerOption: HTMLElement, houseOption: HTMLElement, game: HTMLElement): void {
	const playerPick = playerOption.firstElementChild?.id as PickOption;
	const housePick = houseOption.firstElementChild?.id as PickOption;
	const result = hasWon(playerPick, housePick) as Result;
	playerOption.appendChild(createTextElem('you picked'));
	houseOption.appendChild(createTextElem('the house picked'));
	if (result == 'you won') {
		playerOption.firstElementChild?.classList.add('game__option--win')
	} else if (result !== 'draw') {
		houseOption.firstElementChild?.classList.add('game__option--win')
	}
	const resultElem = createResultElem(result, game);
	game.appendChild(resultElem);
	updateScoreElem(result);
}

function createTextElem(text: string): HTMLElement {
	const textElem = document.createElement('span');
	textElem.classList.add('game__text', 'game__text--picked');
	textElem.textContent = text;
	return textElem;
}

function createResultElem(result: Result, game: HTMLElement): HTMLElement{
	const li = document.createElement('li');
	li.classList.add('game__elem', 'game__elem--3', 'game__elem--play');
	const text = document.createElement('span');
	text.classList.add('game__text', 'game__text--lg');
	text.textContent = result;
	const button = document.createElement('button');
	const innerText = document.createElement('span');
	button.classList.add('game__button');
	button.setAttribute('type', 'button');
	button.setAttribute('id', 'playAgain');
	innerText.textContent = 'play again';
	button.addEventListener('click', initGame.bind(null, game), { once: true, capture: false });
	button.appendChild(innerText);
	li.appendChild(text);
	li.appendChild(button);
	return li;
}

function hasWon(playerPick: PickOption, housePick: PickOption): string {
	if (playerPick === 'rock') {
		switch (housePick) {
			case 'scissors':
				return 'you won';
			case 'paper':
				return 'you lose';
		}
	}
	if (playerPick === 'paper') {
		switch (housePick) {
			case 'scissors':
				return 'you lose';
			case 'rock':
				return 'you won';
		}
	}
	if (playerPick === 'scissors') {
		switch (housePick) {
			case 'paper':
				return 'you won';
			case 'rock':
				return 'you lose';
		}
	}
	return 'draw';
}

function updateScoreElem(result: Result): void {
	const scoreElem = document.querySelector('.score__number') as HTMLElement;
	scoreElem.classList.remove('score__number--changing');
	if (result === 'you won') {
		score++;
	} else {
		score = score - 1 < 0 ? 0 : score - 1;
	}
	scoreElem.textContent = String(score);
	scoreElem.classList.add('score__number--changing');
}

// ------------ //
// OPTIONS      //
// ------------ //
function clearGameOptions(game: HTMLElement): void {
	game.classList.remove('game--results');
	while (game.firstChild) {
		game.removeChild(game.lastChild as ChildNode);
	}
}

function selectOptionClickHandler(event: Event): void {
	const target = event.target as HTMLElement;
	if (gameElem && options.includes(target.id) && target.tagName == 'BUTTON') {
		createWaitingView(target.id, gameElem);
	}
}

function createOptionElem(optionId: string, position: number, isButton: boolean): HTMLElement {
	const li = document.createElement('li');
	li.classList.add('game__elem', `game__elem--${position}`);
	let optionContainer = null;
	if (isButton) {
		optionContainer = document.createElement('button');
		optionContainer.setAttribute('type', 'button');
		optionContainer.setAttribute('aria-label', `Choose ${optionId}`);
	} else {
		optionContainer = document.createElement('div');
	}
	optionContainer.setAttribute('id', optionId);
	optionContainer.classList.add('game__option', `game__option--${optionId}`);
	const svgContainer = document.createElement('div');
	svgContainer.classList.add('game__svg-container');

	/* 
	SVG is only visible when changing href from inspector dev tools.
	I don't know if this is a Vite bug so using img tag until resolved. 

	const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
	svg.setAttribute('role', 'img');
	svg.classList.add('game__svg');
	use.setAttributeNS('http://www.w3.org/2000/xlink', 'href', `/images/icon-${optionId}.svg#${optionId}`)
	svg.appendChild(use);

	*/
	const img = document.createElement('img');
	img.setAttribute('src', `/images/icon-${optionId}.svg#${optionId}`);
	img.classList.add('game__svg', `game__svg--${optionId}`);
	svgContainer.appendChild(img);
	optionContainer.appendChild(svgContainer);
	li.appendChild(optionContainer);
	return li;
}

function createEmptyOptionElem(): HTMLElement {
	const li = document.createElement('li');
	li.classList.add('game__elem', 'game__elem--picking');
	let optionContainer = null;
	optionContainer = document.createElement('div');
	optionContainer.classList.add('game__option');
	const svgContainer = document.createElement('div');
	svgContainer.classList.add('game__svg-container', 'game__svg-container--picking');
	optionContainer.appendChild(svgContainer);
	li.appendChild(optionContainer);
	return li;
}


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

type PickOption = 'rock' | 'paper' | 'scissors';
type Result = 'you won' | 'you lose' | 'draw';