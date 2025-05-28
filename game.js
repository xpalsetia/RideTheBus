class RidetheBusGame {
    constructor() {
        this.deck = [];
        this.piles = [];
        this.selectedPile = null;
        this.gameOver = false;
        this.initGame();
    }

    setupEventListeners() {
        // Remove existing event listeners first to prevent duplicates
        const higherBtn = document.getElementById('higher-btn');
        const lowerBtn = document.getElementById('lower-btn');
        
        if (higherBtn && lowerBtn) {
            // Clone buttons to remove all event listeners
            const newHigherBtn = higherBtn.cloneNode(true);
            const newLowerBtn = lowerBtn.cloneNode(true);
            
            higherBtn.parentNode.replaceChild(newHigherBtn, higherBtn);
            lowerBtn.parentNode.replaceChild(newLowerBtn, lowerBtn);
            
            // Add fresh event listeners
            newHigherBtn.addEventListener('click', () => {
                this.makeGuess('h');
            });
            
            newLowerBtn.addEventListener('click', () => {
                this.makeGuess('l');
            });
        }
    }

    initGame() {
        console.log("Initializing game...");
        
        // Create and shuffle deck (4 of each from 1 to 13)
        this.deck = [];
        for (let value = 1; value <= 13; value++) {
            for (let i = 0; i < 4; i++) {
                this.deck.push(value);
            }
        }
        this.shuffleDeck();
        console.log("Deck created with", this.deck.length, "cards");

        // Initialize 6 piles with one card each
        this.piles = [];
        for (let i = 0; i < 6; i++) {
            this.piles.push([this.deck.pop()]);
        }
        console.log("Piles initialized. Deck now has", this.deck.length, "cards");
        console.log("Pile sizes:", this.piles.map(pile => pile.length));

        this.selectedPile = null;
        this.gameOver = false;
        this.renderGame();
        this.updateMessage("Choose a pile to start playing!");
        
        // Re-setup event listeners in case the controls were replaced
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
                <div class="card" id="card-${index}">
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

        // Remove selection from all piles
        document.querySelectorAll('.pile').forEach(pile => {
            pile.classList.remove('selected');
        });

        // Select the clicked pile
        document.querySelectorAll('.pile')[index].classList.add('selected');
        this.selectedPile = index;

        // Enable guess buttons
        document.getElementById('higher-btn').disabled = false;
        document.getElementById('lower-btn').disabled = false;

        this.updateMessage(`Pile ${index + 1} selected. Will the next card be Higher or Lower than ${this.piles[index][this.piles[index].length - 1]}?`);
    }

    makeGuess(guess) {
        if (this.selectedPile === null || this.gameOver || this.deck.length === 0) return;

        const pileIndex = this.selectedPile;
        const oldCard = this.piles[pileIndex][this.piles[pileIndex].length - 1];
        
        console.log("Before guess - Pile", pileIndex + 1, "size:", this.piles[pileIndex].length);
        console.log("Deck size:", this.deck.length);
        
        const newCard = this.deck.pop();
        console.log("Drew card:", newCard, "- Deck now has:", this.deck.length);

        // Disable buttons during animation
        document.getElementById('higher-btn').disabled = true;
        document.getElementById('lower-btn').disabled = true;

        // Add the new card to the pile
        this.piles[pileIndex].push(newCard);
        console.log("After adding card - Pile", pileIndex + 1, "size:", this.piles[pileIndex].length);

        // Animate the card flip
        const cardElement = document.getElementById(`card-${pileIndex}`);
        cardElement.classList.add('flipping');

        setTimeout(() => {
            cardElement.innerHTML = this.getCardDisplay(newCard);
            cardElement.classList.remove('flipping');
            cardElement.classList.add('new-card');
            
            setTimeout(() => {
                cardElement.classList.remove('new-card');
            }, 600);

            // Check the result
            this.checkGuess(oldCard, newCard, guess, pileIndex);
            
            // Update only the pile count for this specific pile instead of re-rendering everything
            const pileElement = cardElement.parentElement;
            const pileCountElement = pileElement.querySelector('.pile-count');
            pileCountElement.textContent = `${this.piles[pileIndex].length} card${this.piles[pileIndex].length !== 1 ? 's' : ''}`;
            
            // Update deck count
            document.getElementById('deck-count').textContent = `Cards remaining: ${this.deck.length}`;
            
            console.log("After animation - Pile", pileIndex + 1, "final size:", this.piles[pileIndex].length);
            
            // Reset selection
            this.selectedPile = null;
            document.querySelectorAll('.pile').forEach(pile => {
                pile.classList.remove('selected');
            });

            // Check if game is over
            if (this.deck.length === 0) {
                this.endGame();
            }
        }, 400);
    }

    checkGuess(oldCard, newCard, guess, pileIndex) {
        const pileSize = this.piles[pileIndex].length;

        if (newCard === oldCard) {
            const sips = pileSize * 2;
            this.updateMessage(`Same card! Drink ${sips} sips (double pile size).`, 'same');
        } else if ((guess === 'h' && newCard > oldCard) || (guess === 'l' && newCard < oldCard)) {
            this.updateMessage("Correct guess! No drinks. 🎉", 'correct');
        } else {
            const sips = pileSize;
            this.updateMessage(`Wrong guess! Drink ${sips} sips. 🍺`, 'wrong');
        }
    }

    updateMessage(text, type = '') {
        const messageElement = document.getElementById('message');
        messageElement.textContent = text;
        messageElement.className = `message ${type}`;
    }

    endGame() {
        this.gameOver = true;
        const controlsElement = document.getElementById('controls');
        controlsElement.innerHTML = `
            <div class="game-over">
                <h3>🎊 Game Over! 🎊</h3>
                <div class="message game-over">All cards have been dealt!</div>
                <button class="restart-btn" id="restart-btn">🔄 Play Again</button>
            </div>
        `;
        
        // Add event listener for restart button
        document.getElementById('restart-btn').addEventListener('click', () => {
            // Reset the controls HTML
            controlsElement.innerHTML = `
                <h3>Select a pile and make your guess!</h3>
                <div class="button-group">
                    <button class="higher-btn" id="higher-btn" disabled>📈 Higher</button>
                    <button class="lower-btn" id="lower-btn" disabled>📉 Lower</button>
                </div>
                <div class="message" id="message">Choose a pile to start playing!</div>
            `;
            this.initGame();
        });
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.game = new RidetheBusGame();
});