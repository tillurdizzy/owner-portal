import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavErrorComponent } from './nav-error.component';

describe('NavErrorComponent', () => {
  let component: NavErrorComponent;
  let fixture: ComponentFixture<NavErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavErrorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
