import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Board, BoardDetail, CreateBoardRequest, UpdateBoardRequest } from '../../models/board.model';

@Injectable({ providedIn: 'root' })
export class BoardService {
  private baseUrl = `${environment.apiUrl}/boards`;

  constructor(private http: HttpClient) {}

  getBoards(): Observable<Board[]> {
    return this.http.get<Board[]>(this.baseUrl, { withCredentials: true });
  }

  getBoard(id: number): Observable<BoardDetail> {
    return this.http.get<BoardDetail>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }

  createBoard(payload: CreateBoardRequest): Observable<Board> {
    return this.http.post<Board>(this.baseUrl, payload, { withCredentials: true });
  }

  updateBoard(id: number, payload: UpdateBoardRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, payload, { withCredentials: true });
  }

  deleteBoard(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }
}