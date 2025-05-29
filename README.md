# 🚌 Ride the Bus – Card Game Web App

Ride the Bus is a web-based implementation of the popular party card game with two exciting modes: **Classic Rules** and **Metcalf Rules**. Built using vanilla JavaScript, HTML, and CSS, the game offers smooth animations and a clean, responsive UI.

*TRY IT*: https://raw.githack.com/xpalsetia/RideTheBus/refs/heads/main/index.html

---

## 🎮 Game Modes

### 🎯 Metcalf Rules (implemented)

- The game starts with **6 piles**, each containing one card.
- Select a pile, then guess if the next card will be **higher** or **lower**.
- Penalties:
  - ❌ Wrong guess → Drink number of sips equal to the pile size.
  - 🔁 Same card → Drink **double** the pile size.

---

### 🎴 Classic Rules (implemented)

Play through 4 rounds of prediction:
1. **Red or Black** – Guess the color of the next card.
2. **Higher or Lower** – Will the next card be higher or lower?
3. **Inside or Outside** – Is the next card's value between or outside the first two?
4. **Suit Guess** – Guess the exact suit of the fourth card.

Earn sips (penalties) for incorrect guesses.

---

## 📁 File Structure

📦 RideTheBus
```plaintext
src/
├── new.html # Main game layout and embedded script for mode control
├── styles.css # Full styling for both modes and responsive design
└── game.js # Metcalf mode, classic mode, and game manager class
```

✨ Features
✅ Two rule sets: Classic & Metcalf

📱 Responsive and mobile-friendly

🎴 Animated card flips and deals

🧠 Smart game state management

🔁 Restart option when the deck is exhausted

🎨 Stylish UI with gradients, blur, and shadows

## Coming soon🔜
- Classic rules✅
- Fix card duplicates in metcalf rules (suit logic is bad but there are still only 4 of each card because only number matters)
- Multiplayer phone connection...
- Deck control (add more decks/piles?)


