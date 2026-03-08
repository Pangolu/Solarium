import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantesDetail } from './plantes-detail';

describe('PlantesDetail', () => {
  let component: PlantesDetail;
  let fixture: ComponentFixture<PlantesDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantesDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantesDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
