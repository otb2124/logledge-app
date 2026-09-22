import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTicketInlineComponent } from './add-ticket-inline.component';

describe('AddTicketInlineComponent', () => {
  let component: AddTicketInlineComponent;
  let fixture: ComponentFixture<AddTicketInlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTicketInlineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTicketInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
