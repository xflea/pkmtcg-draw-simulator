import { Injectable } from '@angular/core';
import { Deck, DeckCard } from '../models/card';

// Una singola carta fisica "espansa" dal mazzo (senza quantity)
export interface PhysicalCard {
  name: string;
  setCode: string;
  cardNumber: string;
  category: DeckCard['category'];
}

@Injectable({ providedIn: 'root' })
export class DrawSimulatorService {

  // Espande il mazzo "compresso" (con quantity) in un array di 60 carte singole
  expandDeck(deck: Deck): PhysicalCard[] {
    const physical: PhysicalCard[] = [];
    for (const card of deck.cards) {
      for (let i = 0; i < card.quantity; i++) {
        physical.push({
          name: card.name,
          setCode: card.setCode,
          cardNumber: card.cardNumber,
          category: card.category
        });
      }
    }
    return physical;
  }

  // Fisher-Yates shuffle
  private shuffle<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Simula N mani da handSize carte ciascuna, mescolando il mazzo ogni volta
  simulateHands(deck: Deck, handSize: number, numberOfHands: number): PhysicalCard[][] {
    const baseDeck = this.expandDeck(deck);
    const hands: PhysicalCard[][] = [];

    for (let h = 0; h < numberOfHands; h++) {
      const shuffled = this.shuffle(baseDeck);
      hands.push(shuffled.slice(0, handSize));
    }

    return hands;
  }
}