import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantesTable } from './plantes-table';

describe('PlantesTable', () => {
  let component: PlantesTable;
  let fixture: ComponentFixture<PlantesTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantesTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantesTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
