import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { List } from '../models/List';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  numOfTasksBSubject = new BehaviorSubject<number>(0);
  numOfCompletedTasksBSubject = new BehaviorSubject<number>(0);
  selectedListId = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {}
  // lists
  postList(data: any) {
    return this.http.post<any>('http://localhost:3000/lists', data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  getList() {
    return this.http.get<any>('http://localhost:3000/lists').pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  deleteList(id: number) {
    return this.http.delete<any>('http://localhost:3000/lists/' + id).pipe(
      map((res: any) => {
        return res;
      })
    );
  }
  updateList(list: List) {
    return this.http
      .put<any>('http://localhost:3000/lists/' + list.id, list)
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  // tasks
  getTasksFromList() {
    return this.http
      .get<any>(`http://localhost:3000/lists/${this.selectedListId.value}`)
      .pipe(
        map((res: any) => {
          // console.log(res.tasks);
          return res.tasks;
        })
      );
  }

  // util
  updateNumbers(total: number, completed: number) {
    this.numOfTasksBSubject.next(total);
    this.numOfCompletedTasksBSubject.next(completed);
  }
}
