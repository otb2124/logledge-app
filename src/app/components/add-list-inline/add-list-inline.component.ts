import { Component, inject, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BoardListService } from '../../services/boardlist/boardlist.service';
import { BoardList } from '../../models/board.model';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-add-list-inline',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule],
  templateUrl: './add-list-inline.component.html',
})
export class AddListInlineComponent {
  @Input({ required: true }) boardId!: number;
  @Output() added = new EventEmitter<BoardList>();

  private boardListService = inject(BoardListService);

  editing = signal(false);
  name = '';
  saving = signal(false);

  startAdding(): void {
    this.editing.set(true);
  }

  cancel(): void {
    this.editing.set(false);
    this.name = '';
  }

  submit(): void {
    const trimmed = this.name.trim();
    if (!trimmed) return;

    this.saving.set(true);
    this.boardListService.createList(this.boardId, { name: trimmed }).subscribe({
      next: (list) => {
        this.added.emit({ ...list, tickets: [] });
        this.name = '';
        this.saving.set(false);
        this.editing.set(false);
      },
      error: () => this.saving.set(false),
    });
  }
}