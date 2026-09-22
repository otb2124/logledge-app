import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  BoardList,
  CreateBoardListRequest,
  UpdateBoardListRequest,
  ReorderBoardListRequest
} from '../../models/board.model';

@Injectable({ providedIn: 'root' })
export class BoardListService {
  private baseUrl(boardId: number) {
    return `${environment.apiUrl}/boards/${boardId}/lists`;
  }

  constructor(private http: HttpClient) {}

  createList(boardId: number, payload: CreateBoardListRequest): Observable<BoardList> {
    return this.http.post<BoardList>(this.baseUrl(boardId), payload, { withCredentials: true });
  }

  updateList(boardId: number, listId: number, payload: UpdateBoardListRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl(boardId)}/${listId}`, payload, { withCredentials: true });
  }

  reorderList(boardId: number, listId: number, payload: ReorderBoardListRequest): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl(boardId)}/${listId}/position`, payload, { withCredentials: true });
  }

  reorderLists(boardId: number, payload: { orderedListIds: number[] }): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl(boardId)}/reorder`, payload, { withCredentials: true });
  }

  deleteList(boardId: number, listId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl(boardId)}/${listId}`, { withCredentials: true });
  }
}