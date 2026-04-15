import { TestBed } from '@angular/core/testing';

import { CreateChartService } from './create-chart.service';

describe('CreateChartService', () => {
  let service: CreateChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
