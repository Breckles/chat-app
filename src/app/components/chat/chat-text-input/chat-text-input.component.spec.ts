import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatTextInputComponent } from './chat-text-input.component';

describe('ChatTextInputComponent', () => {
  let component: ChatTextInputComponent;
  let fixture: ComponentFixture<ChatTextInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatTextInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatTextInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
