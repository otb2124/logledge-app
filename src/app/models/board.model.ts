export interface Board {
  id: number;
  name: string;
  createdAt: string;
  listCount: number;
}

export interface BoardDetail {
  id: number;
  name: string;
  createdAt: string;
  lists: BoardList[];
}

export interface BoardList {
  id: number;
  name: string;
  position: number;
  tickets: TicketSummary[];
}

export interface TicketSummary {
  id: number;
  title: string;
  priority: 'Low' | 'Medium' | 'High';
  position: number;
}

export interface TicketDetail {
  id: number;
  title: string;
  description: string | null;
  priority: 'Low' | 'Medium' | 'High';
  position: number;
  boardListId: number;
}

export interface CreateTicketRequest {
  title: string;
  priority: 'Low' | 'Medium' | 'High';
}

export interface UpdateTicketRequest {
  title: string;
  description: string | null;
  priority: 'Low' | 'Medium' | 'High';
}

export interface ReorderTicketsRequest {
  orderedTicketIds: number[];
}

export interface MoveTicketRequest {
  targetListId: number;
  position: number;
}

export interface CreateBoardRequest {
  name: string;
}

export interface UpdateBoardRequest {
  name: string;
}

export interface CreateBoardListRequest {
  name: string;
}

export interface UpdateBoardListRequest {
  name: string;
}

export interface ReorderBoardListRequest {
  position: number;
}