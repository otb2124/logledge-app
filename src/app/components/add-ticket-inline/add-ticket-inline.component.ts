import { Component, inject, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../services/ticket/ticket.service';
import { TicketSummary } from '../../models/board.model';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-add-ticket-inline',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
  templateUrl: './add-ticket-inline.component.html',
})
export class AddTicketInlineComponent {
  @Input({ required: true }) boardId!: number;
  @Input({ required: true }) listId!: number;
  @Output() added = new EventEmitter<TicketSummary>();

  private ticketService = inject(TicketService);

  editing = signal(false);
  title = '';
  saving = signal(false);

  startAdding(): void {
    this.editing.set(true);
  }

  cancel(): void {
    this.editing.set(false);
    this.title = '';
  }

  submit(): void {
    const trimmed = this.title.trim();
    if (!trimmed) return;

    this.saving.set(true);
    this.ticketService.createTicket(this.boardId, this.listId, { title: trimmed, priority: 'Medium' }).subscribe({
      next: (ticket) => {
        this.added.emit(ticket);
        this.title = '';
        this.saving.set(false);
        // stay in editing mode so users can rapid-fire add several tickets, Trello-style
      },
      error: () => this.saving.set(false),
    });
  }
}