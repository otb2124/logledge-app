import { TestBed } from '@angular/core/testing';

import { BoardlistService } from './boardlist.service';

describe('BoardlistService', () => {
  let service: BoardlistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BoardlistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
