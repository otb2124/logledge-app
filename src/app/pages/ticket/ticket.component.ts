import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TicketService } from '../../services/ticket/ticket.service';
import { TicketDetail } from '../../models/board.model';
import { FieldConfig, FieldList } from '../../components/field-list/field-list';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [CommonModule, FieldList, ButtonModule],
  templateUrl: './ticket.component.html',
})
export class TicketPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ticketService = inject(TicketService);

  private boardId!: number;
  private listId!: number;
  private ticketId!: number;

  ticket = signal<TicketDetail | null>(null);
  model: Record<string, any> = {};
  loading = signal(true);
  saving = signal(false);

  fields: FieldConfig[] = [
    {
      path: 'title', label: 'Title', kind: 'text',
      validators: [{ type: 'required', message: 'Title is required.' }],
    },
    {
      path: 'priority', label: 'Priority', kind: 'select',
      options: [
        { label: 'Low', value: 'Low' },
        { label: 'Medium', value: 'Medium' },
        { label: 'High', value: 'High' },
      ],
      validators: [{ type: 'required', message: 'Priority is required.' }],
    },
    { path: 'description', label: 'Description', kind: 'text' },
  ];

  ngOnInit(): void {
    this.boardId = Number(this.route.snapshot.paramMap.get('boardId'));
    this.ticketId = Number(this.route.snapshot.paramMap.get('ticketId'));
    this.listId = Number(this.route.snapshot.queryParamMap.get('listId'));

    this.ticketService.getTicket(this.boardId, this.listId, this.ticketId).subscribe({
      next: (ticket) => {
        this.ticket.set(ticket);
        this.model = { title: ticket.title, priority: ticket.priority, description: ticket.description ?? '' };
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  save(): void {
    this.saving.set(true);
    this.ticketService.updateTicket(this.boardId, this.listId, this.ticketId, {
      title: this.model['title'],
      description: this.model['description'],
      priority: this.model['priority'],
    }).subscribe({
      next: () => {
        this.saving.set(false);
        this.close();
      },
      error: () => this.saving.set(false),
    });
  }

  delete(): void {
    this.ticketService.deleteTicket(this.boardId, this.listId, this.ticketId).subscribe({
      next: () => this.close(),
    });
  }

  close(): void {
    this.router.navigate(['/boards', this.boardId]);
  }
}