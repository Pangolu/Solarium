import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantaCard } from './planta-card';

describe('PlantaCard', () => {
  let component: PlantaCard;
  let fixture: ComponentFixture<PlantaCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantaCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantaCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
