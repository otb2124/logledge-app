import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  TicketSummary,
  CreateTicketRequest,
  UpdateTicketRequest,
  ReorderTicketsRequest,
  MoveTicketRequest,
  TicketDetail
} from '../../models/board.model';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private baseUrl(boardId: number, listId: number) {
    return `${environment.apiUrl}/boards/${boardId}/lists/${listId}/tickets`;
  }

  constructor(private http: HttpClient) {}

  getTicket(boardId: number, listId: number, ticketId: number): Observable<TicketDetail> {
    return this.http.get<TicketDetail>(`${this.baseUrl(boardId, listId)}/${ticketId}`, { withCredentials: true });
  }

  createTicket(boardId: number, listId: number, payload: CreateTicketRequest): Observable<TicketSummary> {
    return this.http.post<TicketSummary>(this.baseUrl(boardId, listId), payload, { withCredentials: true });
  }

  updateTicket(boardId: number, listId: number, ticketId: number, payload: UpdateTicketRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl(boardId, listId)}/${ticketId}`, payload, { withCredentials: true });
  }

  reorderTickets(boardId: number, listId: number, payload: ReorderTicketsRequest): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl(boardId, listId)}/reorder`, payload, { withCredentials: true });
  }

  moveTicket(boardId: number, listId: number, ticketId: number, payload: MoveTicketRequest): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl(boardId, listId)}/${ticketId}/move`, payload, { withCredentials: true });
  }

  deleteTicket(boardId: number, listId: number, ticketId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl(boardId, listId)}/${ticketId}`, { withCredentials: true });
  }
}