import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantesList } from './plantes-list';

describe('PlantesList', () => {
  let component: PlantesList;
  let fixture: ComponentFixture<PlantesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantesList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantesList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
