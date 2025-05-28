## originial build in milan on phone lol

import random
import time

# Create and shuffle the deck (4 of each from 1 to 13)
deck = [value for value in range(1, 14) for _ in range(4)]
random.shuffle(deck)

# Initialize 6 piles, each with one card from the deck
piles = [[deck.pop()] for _ in range(6)]

def display_piles():
    print("\nCurrent Piles:")
    for i, pile in enumerate(piles):
        print(f"Pile {i + 1}: Top Card = {pile[-1]}, Cards in Pile = 
{len(pile)}")

def get_player_choice():
    while True:
        try:
            pile_choice = int(input("Choose a pile (1-6): "))
            if 1 <= pile_choice <= 6:
                break
        except ValueError:
            pass
        print("Invalid pile number. Try again.")
    
    while True:
        guess = input("Higher or Lower? (h/l): ").lower()
        if guess in ["h", "l"]:
            break
        print("Invalid choice. Type 'h' for higher or 'l' for lower.")
    
    return pile_choice - 1, guess

def play_turn():
    if not deck:
        return False

    display_piles()
    pile_index, guess = get_player_choice()

    old_card = piles[pile_index][-1]
    new_card = deck.pop()
    piles[pile_index].append(new_card)

    print(f"New card: {new_card}")

    if new_card == old_card:
        sips = len(piles[pile_index]) * 2
        print(f"Same card! Drink {sips} sips (double pile size).")
        time.sleep(5)
    elif (guess == "h" and new_card > old_card) or (guess == "l" and 
new_card < old_card):
        print("Correct guess! No drinks.")
        time.sleep(5)
    else:
        sips = len(piles[pile_index])
        print(f"Wrong guess! Drink {sips} sips.")
        time.sleep(5)

    return True

# Main game loop
print("Welcome to Ride the Bus!")
while play_turn():
    pass

print("\nAll cards have been dealt. End of game!")
