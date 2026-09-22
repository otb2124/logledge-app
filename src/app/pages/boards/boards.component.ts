import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BoardService } from '../../services/board/board.service';
import { Board } from '../../models/board.model';
import { ButtonModule } from 'primeng/button';
import { InputText, InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-boards-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, InputTextModule, ButtonModule, InputText],
  templateUrl: './boards.component.html',
})
export class BoardsPageComponent implements OnInit {
  private boardService = inject(BoardService);
  private router = inject(Router);

  boards = signal<Board[]>([]);
  loading = signal(true);

  addingNew = signal(false);
  newBoardName = '';
  saving = signal(false);

  ngOnInit(): void {
    this.boardService.getBoards().subscribe({
      next: (boards) => {
        this.boards.set(boards);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  startAdding(): void {
    this.addingNew.set(true);
  }

  cancelAdding(): void {
    this.addingNew.set(false);
    this.newBoardName = '';
  }

  submitNewBoard(): void {
    const trimmed = this.newBoardName.trim();
    if (!trimmed) return;

    this.saving.set(true);
    this.boardService.createBoard({ name: trimmed }).subscribe({
      next: (board) => {
        this.boards.update(list => [board, ...list]);
        this.newBoardName = '';
        this.saving.set(false);
        this.addingNew.set(false);
      },
      error: () => this.saving.set(false),
    });
  }

  openBoard(board: Board): void {
    this.router.navigate(['/boards', board.id]);
  }
}