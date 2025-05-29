// Game mode management
class GameModeManager {
    constructor() {
        this.currentMode = 'classic';
        this.metcalfGame = null;
        this.classicGame = null;
        this.setupModeSelector();
        this.initializeGames();
    }

    setupModeSelector() {
        document.getElementById('metcalf-mode-btn').addEventListener('click', () => {
            this.switchMode('metcalf');
        });
        
        document.getElementById('classic-mode-btn').addEventListener('click', () => {
            this.switchMode('classic');
        });
    }

    switchMode(mode) {
        this.currentMode = mode;
        
        // Update button states
        document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`${mode}-mode-btn`).classList.add('active');
        
        // Switch between containers for modes (metcalf classic potentially others)
        document.querySelectorAll('.game-container').forEach(container => {
            container.classList.remove('active');
        });
        document.getElementById(`${mode}-container`).classList.add('active');
        
        // Initialize or reset the appropriate game
        if (mode === 'metcalf') {
            if (!this.metcalfGame) {
                this.metcalfGame = new MetcalfGame();
            } else {
                this.metcalfGame.initGame();
            }
        } else {
            if (!this.classicGame) {
                this.classicGame = new ClassicGame();
            } else {
                this.classicGame.initGame();
            }
        }
    }

    initializeGames() {
        // Start with classic mode
        this.classicGame = new classicGame();
    }
}

// Classic Ride the Bus Game
class ClassicGame {
    constructor() {
        this.deck = [];
        this.gameCards = [];
        this.currentStep = 1;
        this.drinks = 0;
        this.gameOver = false;
        this.initGame();
    }

    initGame() {
        console.log("Initializing Classic Game...");
        
        // Create and shuffle deck
        this.deck = [];
        const suits = ['♠️', '♥️', '♦️', '♣️'];
        for (let suit of suits) {
            for (let value = 1; value <= 13; value++) {
                this.deck.push({ value, suit, color: (suit === '♥️' || suit === '♦️') ? 'red' : 'black' });
            }
        }
        this.shuffleDeck();

        // Draw 4 cards for the game
        this.gameCards = [
            this.deck.pop(),
            this.deck.pop(),
            this.deck.pop(),
            this.deck.pop()
        ];

        this.currentStep = 1;
        this.drinks = 0;
        this.gameOver = false;
        
        this.resetDisplay();
        this.updateQuestion();
        this.updateMessage("Make your first guess to start riding the bus!", 'neutral');
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    resetDisplay() {
        // Reset progress steps
        for (let i = 1; i <= 4; i++) {
            const step = document.getElementById(`step-${i}`);
            step.className = i === 1 ? 'progress-step active' : 'progress-step pending';
        }

        // Reset cards display
        for (let i = 1; i <= 4; i++) {
            const card = document.getElementById(`card-${i}`);
            card.className = 'classic-card hidden';
            card.textContent = '?';
        }

        document.getElementById('current-step').textContent = '1';
    }

    updateQuestion() {
        const questionText = document.getElementById('question-text');
        const buttonsContainer = document.getElementById('classic-buttons');
        
        switch (this.currentStep) {
            case 1:
                questionText.textContent = "Is the first card Red or Black?";
                buttonsContainer.innerHTML = `
                    <button class="red-btn" onclick="classicGame.makeGuess('red')">♥️ Red</button>
                    <button class="black-btn" onclick="classicGame.makeGuess('black')">♠️ Black</button>
                `;
                break;
            case 2:
                questionText.textContent = `Is the second card Higher or Lower than ${this.getCardDisplay(this.gameCards[0])}?`;
                buttonsContainer.innerHTML = `
                    <button class="higher-btn" onclick="classicGame.makeGuess('higher')">📈 Higher</button>
                    <button class="lower-btn" onclick="classicGame.makeGuess('lower')">📉 Lower</button>
                `;
                break;
            case 3:
                const card1 = this.gameCards[0].value;
                const card2 = this.gameCards[1].value;
                const low = Math.min(card1, card2);
                const high = Math.max(card1, card2);
                questionText.textContent = `Is the third card Inside (${low}-${high}) or Outside?`;
                buttonsContainer.innerHTML = `
                    <button class="inside-btn" onclick="classicGame.makeGuess('inside')">📊 Inside</button>
                    <button class="outside-btn" onclick="classicGame.makeGuess('outside')">📤 Outside</button>
                `;
                break;
            case 4:
                questionText.textContent = "What suit is the fourth card?";
                buttonsContainer.innerHTML = `
                    <button class="suit-btn" onclick="classicGame.makeGuess('♠️')">♠️ Spades</button>
                    <button class="suit-btn" onclick="classicGame.makeGuess('♥️')">♥️ Hearts</button>
                    <button class="suit-btn" onclick="classicGame.makeGuess('♦️')">♦️ Diamonds</button>
                    <button class="suit-btn" onclick="classicGame.makeGuess('♣️')">♣️ Clubs</button>
                `;
                break;
        }
    }

    makeGuess(guess) {
        if (this.gameOver) return;

        // Disable buttons during animation
        document.querySelectorAll('#classic-buttons button').forEach(btn => btn.disabled = true);

        const cardIndex = this.currentStep - 1;
        const card = this.gameCards[cardIndex];
        let correct = false;

        // Reveal the card with animation
        this.revealCard(cardIndex);

        setTimeout(() => {
            // Check if guess is correct
            switch (this.currentStep) {
                case 1:
                    correct = guess === card.color;
                    break;
                case 2:
                    const prevCard = this.gameCards[0];
                    if (guess === 'higher') {
                        correct = card.value > prevCard.value;
                    } else {
                        correct = card.value < prevCard.value;
                    }
                    break;
                case 3:
                    const card1 = this.gameCards[0].value;
                    const card2 = this.gameCards[1].value;
                    const low = Math.min(card1, card2);
                    const high = Math.max(card1, card2);
                    const isInside = card.value > low && card.value < high;
                    correct = (guess === 'inside' && isInside) || (guess === 'outside' && !isInside);
                    break;
                case 4:
                    correct = guess === card.suit;
                    break;
            }

            if (correct) {
                this.updateMessage(`Correct! ${this.getCardDisplay(card)}`, 'correct');
                document.getElementById(`step-${this.currentStep}`).className = 'progress-step completed';
                
                if (this.currentStep === 4) {
                    this.gameWon();
                } else {
                    this.currentStep++;
                    document.getElementById(`step-${this.currentStep}`).className = 'progress-step active';
                    document.getElementById('current-step').textContent = this.currentStep;
                    
                    setTimeout(() => {
                        this.updateQuestion();
                    }, 1500);
                }
            } else {
                this.drinks++;
                this.updateMessage(`Wrong! ${this.getCardDisplay(card)} - Drink ${this.drinks} sip${this.drinks > 1 ? 's' : ''}! Starting over...`, 'wrong');
                
                setTimeout(() => {
                    this.restartGame();
                }, 2000);
            }
        }, 800);
    }

    revealCard(index) {
        const cardElement = document.getElementById(`card-${index + 1}`);
        cardElement.classList.add('flipping');
        
        setTimeout(() => {
            cardElement.classList.remove('hidden', 'flipping');
            cardElement.textContent = this.getCardDisplay(this.gameCards[index]);
        }, 400);
    }

    getCardDisplay(card) {
        let valueStr = card.value.toString();
        if (card.value === 1) valueStr = 'A';
        else if (card.value === 11) valueStr = 'J';
        else if (card.value === 12) valueStr = 'Q';
        else if (card.value === 13) valueStr = 'K';
        
        return `${valueStr}${card.suit}`;
    }

    gameWon() {
        this.gameOver = true;
        this.updateMessage(`🎉 Congratulations! You successfully rode the bus! Total drinks: ${this.drinks}`, 'correct');
        
        document.getElementById('classic-buttons').innerHTML = `
            <button class="restart-btn" onclick="classicGame.initGame()">🔄 Play Again</button>
        `;
    }

    restartGame() {
        // Redraw new cards
        this.gameCards = [
            this.deck.pop() || this.getRandomCard(),
            this.deck.pop() || this.getRandomCard(),
            this.deck.pop() || this.getRandomCard(),
            this.deck.pop() || this.getRandomCard()
        ];
        
        // If deck is empty, reshuffle
        if (this.deck.length < 10) {
            this.initGame();
            return;
        }
        
        this.currentStep = 1;
        this.resetDisplay();
        this.updateQuestion();
        this.updateMessage(`Starting over... Total drinks so far: ${this.drinks}`, 'neutral');
    }

    getRandomCard() {
        const suits = ['♠️', '♥️', '♦️', '♣️'];
        const suit = suits[Math.floor(Math.random() * suits.length)];
        const value = Math.floor(Math.random() * 13) + 1;
        return { value, suit, color: (suit === '♥️' || suit === '♦️') ? 'red' : 'black' };
    }

    updateMessage(text, type = 'neutral') {
        const messageElement = document.getElementById('classic-message');
        messageElement.textContent = text;
        messageElement.className = `message ${type}`;
    }
}

// Metcalf Game
class MetcalfGame {
    constructor() {
        this.deck = [];
        this.piles = [];
        this.selectedPile = null;
        this.gameOver = false;
        this.initGame();
    }

    setupEventListeners() {
        const higherBtn = document.getElementById('higher-btn');
        const lowerBtn = document.getElementById('lower-btn');
        
        if (higherBtn && lowerBtn) {
            const newHigherBtn = higherBtn.cloneNode(true);
            const newLowerBtn = lowerBtn.cloneNode(true);
            
            higherBtn.parentNode.replaceChild(newHigherBtn, higherBtn);
            lowerBtn.parentNode.replaceChild(newLowerBtn, lowerBtn);
            
            newHigherBtn.addEventListener('click', () => {
                this.makeGuess('h');
            });
            
            newLowerBtn.addEventListener('click', () => {
                this.makeGuess('l');
            });
        }
    }

    initGame() {
        console.log("Initializing Metcalf game...");
        
        this.deck = [];
        for (let value = 1; value <= 13; value++) {
            for (let i = 0; i < 4; i++) {
                this.deck.push(value);
            }
        }
        this.shuffleDeck();

        this.piles = [];
        for (let i = 0; i < 6; i++) {
            this.piles.push([this.deck.pop()]);
        }

        this.selectedPile = null;
        this.gameOver = false;
        this.renderGame();
        this.updateMessage("Choose a pile to start playing!");
        this.setupEventListeners();
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    renderGame() {
        const container = document.getElementById('piles-container');
        container.innerHTML = '';

        this.piles.forEach((pile, index) => {
            const pileElement = document.createElement('div');
            pileElement.className = 'pile';
            pileElement.addEventListener('click', () => this.selectPile(index));
            
            pileElement.innerHTML = `
                <div class="pile-header">Pile ${index + 1}</div>
                <div class="card" id="metcalf-card-${index}">
                    ${this.getCardDisplay(pile[pile.length - 1])}
                </div>
                <div class="pile-count">${pile.length} card${pile.length !== 1 ? 's' : ''}</div>
            `;
            
            container.appendChild(pileElement);
        });

        document.getElementById('deck-count').textContent = `Cards remaining: ${this.deck.length}`;
    }

    getCardDisplay(value) {
        const suits = ['♠️', '♥️', '♦️', '♣️'];
        const suit = suits[Math.floor(Math.random() * suits.length)];
        
        if (value === 1) return `A${suit}`;
        if (value === 11) return `J${suit}`;
        if (value === 12) return `Q${suit}`;
        if (value === 13) return `K${suit}`;
        return `${value}${suit}`;
    }

    selectPile(index) {
        if (this.gameOver || this.deck.length === 0) return;

        document.querySelectorAll('.pile').forEach(pile => {
            pile.classList.remove('selected');
        });

        document.querySelectorAll('.pile')[index].classList.add('selected');
        this.selectedPile = index;

        document.getElementById('higher-btn').disabled = false;
        document.getElementById('lower-btn').disabled = false;

        this.updateMessage(`Pile ${index + 1} selected. Will the next card be Higher or Lower than ${this.piles[index][this.piles[index].length - 1]}?`);
    }

    makeGuess(guess) {
        if (this.selectedPile === null || this.gameOver || this.deck.length === 0) return;

        const pileIndex = this.selectedPile;
        const oldCard = this.piles[pileIndex][this.piles[pileIndex].length - 1];
        const newCard = this.deck.pop();

        document.getElementById('higher-btn').disabled = true;
        document.getElementById('lower-btn').disabled = true;

        this.piles[pileIndex].push(newCard);

        const cardElement = document.getElementById(`metcalf-card-${pileIndex}`);
        cardElement.classList.add('flipping');

        setTimeout(() => {
            cardElement.innerHTML = this.getCardDisplay(newCard);
            cardElement.classList.remove('flipping');

            this.checkGuess(oldCard, newCard, guess, pileIndex);
            
            const pileElement = cardElement.parentElement;
            const pileCountElement = pileElement.querySelector('.pile-count');
            pileCountElement.textContent = `${this.piles[pileIndex].length} card${this.piles[pileIndex].length !== 1 ? 's' : ''}`;
            
            document.getElementById('deck-count').textContent = `Cards remaining: ${this.deck.length}`;
            
            this.selectedPile = null;
            document.querySelectorAll('.pile').forEach(pile => {
                pile.classList.remove('selected');
            });

            if (this.deck.length === 0) {
                this.endGame();
            }
        }, 400);
    }

    checkGuess(oldCard, newCard, guess, pileIndex) {
        const pileSize = this.piles[pileIndex].length;

        if (newCard === oldCard) {
            const sips = pileSize * 2;
            this.updateMessage(`Same card! Drink ${sips} sips (double pile size).`, 'wrong');
        } else if ((guess === 'h' && newCard > oldCard) || (guess === 'l' && newCard < oldCard)) {
            this.updateMessage("Correct guess! No drinks. 🎉", 'correct');
        } else {
            const sips = pileSize;
            this.updateMessage(`Wrong guess! Drink ${sips} sips. 🍺`, 'wrong');
        }
    }

    updateMessage(text, type = '') {
        const messageElement = document.getElementById('metcalf-message');
        messageElement.textContent = text;
        messageElement.className = `message ${type}`;
    }

    endGame() {
        this.gameOver = true;
        const controlsElement = document.getElementById('metcalf-controls');
        controlsElement.innerHTML = `
            <div class="game-over">
                <h3>🎊 Game Over! 🎊</h3>
                <div class="message neutral">All cards have been dealt!</div>
                <button class="restart-btn" onclick="gameManager.metcalfGame.initGame()">🔄 Play Again</button>
            </div>
        `;
    }
}

// innit the game manager when the page loads
let gameManager;
let classicGame;

document.addEventListener('DOMContentLoaded', () => {
    gameManager = new GameModeManager();
    classicGame = gameManager.classicGame; //globally accessible for onclick handlers
});