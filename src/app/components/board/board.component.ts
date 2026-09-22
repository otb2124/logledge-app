import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { BoardService } from '../../services/board/board.service';
import { BoardListService } from '../../services/boardlist/boardlist.service';
import { TicketService } from '../../services/ticket/ticket.service';
import { BoardDetail, BoardList, TicketSummary } from '../../models/board.model';
import { AddTicketInlineComponent } from '../../components/add-ticket-inline/add-ticket-inline.component';
import { AddListInlineComponent } from '../../components/add-list-inline/add-list-inline.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-board-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DragDropModule, AddTicketInlineComponent, AddListInlineComponent],
  templateUrl: './board.component.html',
})
export class BoardComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private boardService = inject(BoardService);
  private boardListService = inject(BoardListService);
  private ticketService = inject(TicketService);

  board = signal<BoardDetail | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    const boardId = Number(this.route.snapshot.paramMap.get('boardId'));
    this.boardService.getBoard(boardId).subscribe({
      next: (board) => {
        this.board.set(board);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  // CDK connects drop lists by id — each BoardList's cdkDropList uses "list-{id}"
  listIds(): string[] {
    return this.board()?.lists.map(l => `list-${l.id}`) ?? [];
  }

  onTicketDrop(event: CdkDragDrop<TicketSummary[]>, list: BoardList): void {
    const board = this.board();
    if (!board) return;

    if (event.previousContainer === event.container) {
      // Same-list reorder
      if (event.previousIndex === event.currentIndex) return;

      moveItemInArray(list.tickets, event.previousIndex, event.currentIndex);
      this.board.set({ ...board }); // trigger change detection on the signal

      const orderedTicketIds = list.tickets.map(t => t.id);
      this.ticketService.reorderTickets(board.id, list.id, { orderedTicketIds }).subscribe({
        error: () => {
          // Revert on failure
          moveItemInArray(list.tickets, event.currentIndex, event.previousIndex);
          this.board.set({ ...board });
        },
      });
    } else {
      // Cross-list move
      const sourceListId = Number(event.previousContainer.id.replace('list-', ''));
      const sourceList = board.lists.find(l => l.id === sourceListId);
      if (!sourceList) return;

      const ticket = event.previousContainer.data[event.previousIndex];

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.board.set({ ...board });

      this.ticketService.moveTicket(board.id, sourceListId, ticket.id, {
        targetListId: list.id,
        position: event.currentIndex,
      }).subscribe({
        error: () => {
          // Revert on failure — move it back
          transferArrayItem(
            event.container.data,
            event.previousContainer.data,
            event.currentIndex,
            event.previousIndex
          );
          this.board.set({ ...board });
        },
      });
    }
  }

  onListDrop(event: CdkDragDrop<BoardList[]>): void {
    const board = this.board();
    if (!board || event.previousIndex === event.currentIndex) return;

    const previousOrder = [...board.lists];
    moveItemInArray(board.lists, event.previousIndex, event.currentIndex);
    this.board.set({ ...board });

    const orderedListIds = board.lists.map(l => l.id);
    this.boardListService.reorderLists(board.id, { orderedListIds }).subscribe({
      error: () => {
        this.board.set({ ...board, lists: previousOrder });
      },
    });
  }

  onTicketAdded(list: BoardList, ticket: TicketSummary): void {
    list.tickets.push(ticket);
    this.board.set({ ...this.board()! });
  }

  onListAdded(list: BoardList): void {
    const board = this.board();
    if (!board) return;
    this.board.set({ ...board, lists: [...board.lists, list] });
  }
}