import { Injectable } from '@angular/core';
import { CardCategory, DeckCard, Deck } from '../models/card';

@Injectable({ providedIn: 'root' })
export class DecklistParserService {

  parse(rawText: string): Deck {
    const lines = rawText
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    const cards: DeckCard[] = [];
    let currentCategory: CardCategory | null = null;

    // Riconosce le righe di intestazione tipo "Pokémon: 19", "Trainer: 33", "Energy: 8"
    const headerRegex = /^(Pok[eé]mon|Trainer|Energy):\s*(\d+)$/i;

    // Riconosce le righe carta: quantità, nome (greedy ma non ingordo), set code, numero
    const cardRegex = /^(\d+)\s+(.+?)\s+([A-Z0-9]{2,6})\s+([A-Za-z0-9]+)$/;

    for (const line of lines) {
      const headerMatch = line.match(headerRegex);
      if (headerMatch) {
        const label = headerMatch[1].toLowerCase();
        currentCategory =
          label.startsWith('pok') ? 'pokemon' :
          label.startsWith('trainer') ? 'trainer' : 'energy';
        continue;
      }

      const cardMatch = line.match(cardRegex);
      if (cardMatch && currentCategory) {
        const [, qty, name, setCode, cardNumber] = cardMatch;
        cards.push({
          quantity: parseInt(qty, 10),
          name: name.trim(),
          setCode,
          cardNumber,
          category: currentCategory
        });
      }
      // righe non riconosciute vengono semplicemente ignorate
    }

    const totalCount = cards.reduce((sum, c) => sum + c.quantity, 0);
    return { cards, totalCount };
  }
}