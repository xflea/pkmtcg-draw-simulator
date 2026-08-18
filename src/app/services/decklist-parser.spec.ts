import { TestBed } from '@angular/core/testing';

import { DecklistParser } from './decklist-parser';

describe('DecklistParser', () => {
  let service: DecklistParser;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DecklistParser);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
