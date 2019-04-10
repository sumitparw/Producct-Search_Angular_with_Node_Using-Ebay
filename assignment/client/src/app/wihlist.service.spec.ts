import { TestBed } from '@angular/core/testing';

import { WishlistService } from './wihlist.service';

describe('WihlistService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WishlistService = TestBed.get(WishlistService);
    expect(service).toBeTruthy();
  });
});
