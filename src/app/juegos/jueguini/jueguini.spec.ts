import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Jueguini } from './jueguini';

describe('Jueguini', () => {
  let component: Jueguini;
  let fixture: ComponentFixture<Jueguini>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Jueguini],
    }).compileComponents();

    fixture = TestBed.createComponent(Jueguini);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
