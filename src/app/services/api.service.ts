import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { List } from '../models/List';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  numOfTasksBSubject = new BehaviorSubject<number>(0); // footer
  numOfCompletedTasksBSubject = new BehaviorSubject<number>(0); // footer

  selectedListId = new BehaviorSubject<number>(0); // helps validator to find tasks from the selected list

  constructor(private http: HttpClient) {}

  // lists
  // POST list
  postList(data: any) {
    return this.http.post<any>('http://localhost:3000/lists', data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // GET list
  getList() {
    return this.http.get<any>('http://localhost:3000/lists').pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // DELETE list
  deleteList(id: number) {
    return this.http.delete<any>('http://localhost:3000/lists/' + id).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // PUT list
  updateList(list: List) {
    return this.http
      .put<any>('http://localhost:3000/lists/' + list.id, list)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  // GET lists -- returns list's tasks
  getTasksFromList() {
    return this.http
      .get<any>(`http://localhost:3000/lists/${this.selectedListId.value}`)
      .pipe(
        map((res: any) => {
          return res.tasks;
        })
      );
  }

  // util -- update footer
  updateNumbers(total: number, completed: number) {
    this.numOfTasksBSubject.next(total);
    this.numOfCompletedTasksBSubject.next(completed);
  }
}
