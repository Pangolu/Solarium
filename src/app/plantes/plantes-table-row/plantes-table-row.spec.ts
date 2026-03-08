import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantesTableRow } from './plantes-table-row';

describe('PlantesTableRow', () => {
  let component: PlantesTableRow;
  let fixture: ComponentFixture<PlantesTableRow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantesTableRow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantesTableRow);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
