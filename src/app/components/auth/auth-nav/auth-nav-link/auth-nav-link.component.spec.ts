import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthNavButtonComponent } from './auth-nav-link.component';

describe('AuthNavButtonComponent', () => {
  let component: AuthNavButtonComponent;
  let fixture: ComponentFixture<AuthNavButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuthNavButtonComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthNavButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
