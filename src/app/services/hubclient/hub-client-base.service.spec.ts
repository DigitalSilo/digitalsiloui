import { TestBed } from '@angular/core/testing';

import { HubClientBaseService } from './hub-client-base.service';

describe('HubClientBaseService', () => {
  let service: HubClientBaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HubClientBaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
