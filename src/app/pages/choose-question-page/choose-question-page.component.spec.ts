import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseQuestionPageComponent } from './choose-question-page.component';

describe('ChooseQuestionPageComponent', () => {
  let component: ChooseQuestionPageComponent;
  let fixture: ComponentFixture<ChooseQuestionPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseQuestionPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChooseQuestionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
