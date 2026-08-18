export type CardCategory = 'pokemon' | 'trainer' | 'energy';

export interface DeckCard {
  quantity: number;
  name: string;
  setCode: string;
  cardNumber: string;
  category: CardCategory;
}

// Rappresenta un mazzo "espanso": una entry per ogni singola carta fisica,
// utile per pescare/mescolare
export interface Deck {
  cards: DeckCard[]; // le righe originali (con quantity)
  totalCount: number;
}