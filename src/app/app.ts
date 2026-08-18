import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DecklistParserService } from './services/decklist-parser';
import { DrawSimulatorService, PhysicalCard } from './services/draw-simulator';
import { Deck } from './models/card';

const STANDARD_HAND_SIZE = 7;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html'
})
export class App {
  decklistText = signal<string>('');
  numberOfHands = signal<number>(10);
  parseError = signal<string | null>(null);

  constructor(
    private parser: DecklistParserService,
    private drawSimulator: DrawSimulatorService
  ) {}

  drawHands() {
    const text = this.decklistText();
    if (!text.trim()) {
      this.parseError.set('Paste a decklist.');
      return;
    }

    const parsed = this.parser.parse(text);
    if (parsed.totalCount === 0) {
      this.parseError.set('An error occured, please check again the deck format.');
      return;
    }

    this.parseError.set(null);

    const hands = this.drawSimulator.simulateHands(
      parsed,
      STANDARD_HAND_SIZE,
      this.numberOfHands()
    );

    this.openResultsInNewTab(hands, parsed);
  }

  // Apre i risultati in una nuova scheda, come pagina HTML statica indipendente
  private openResultsInNewTab(hands: PhysicalCard[][], deck: Deck) {
    const html = this.buildResultsHtml(hands, deck);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  }

  private categoryColor(category: string): string {
    switch (category) {
      case 'pokemon': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'trainer': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'energy': return 'bg-lime-100 text-lime-800 border-lime-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  }

  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  private buildResultsHtml(hands: PhysicalCard[][], deck: Deck): string {
    const handsHtml = hands.map((hand, i) => `
      <div class="border rounded-lg p-4 bg-white">
        <h3 class="font-semibold mb-2">Hand #${i + 1}</h3>
        <ul class="space-y-1 text-sm">
          ${hand.map(c => `
            <li class="flex justify-between border rounded px-2 py-1 ${this.categoryColor(c.category)}">
              <span>${this.escapeHtml(c.name)}</span>
              <span class="text-xs opacity-60">${c.setCode} ${c.cardNumber}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    `).join('');

    const timestamp = new Date().toLocaleTimeString('it-IT');

    return `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<title>Simulation ${timestamp}</title>
<script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen bg-gray-50 py-8 px-4">
  <div class="max-w-4xl mx-auto space-y-6">
    <header class="text-center">
      <h1 class="text-2xl font-bold text-gray-900">Simulation — ${timestamp}</h1>
      <p class="text-gray-500 mt-1">Deck: ${deck.totalCount} cards · ${hands.length} hand${hands.length > 1 ? 's' : ''}</p>
    </header>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${handsHtml}
    </div>
  </div>
</body>
</html>`;
  }
}