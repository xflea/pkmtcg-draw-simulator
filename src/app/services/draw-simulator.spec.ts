import { TestBed } from '@angular/core/testing';

import { DrawSimulator } from './draw-simulator';

describe('DrawSimulator', () => {
  let service: DrawSimulator;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrawSimulator);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
