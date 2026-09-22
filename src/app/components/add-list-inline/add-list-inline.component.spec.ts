import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddListInlineComponent } from './add-list-inline.component';

describe('AddListInlineComponent', () => {
  let component: AddListInlineComponent;
  let fixture: ComponentFixture<AddListInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddListInlineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddListInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
