import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserChatroomsComponent } from './user-chatrooms.component';

describe('UserChatroomsComponent', () => {
  let component: UserChatroomsComponent;
  let fixture: ComponentFixture<UserChatroomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserChatroomsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserChatroomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
