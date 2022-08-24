import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  numOfTasks: number = 0;
  numOfCompletedTasks: number = 0;

  constructor(private api: ApiService) {}
  ngOnInit(): void {
    this.api.numOfTasksBSubject.subscribe((data) => (this.numOfTasks = data));
    this.api.numOfCompletedTasksBSubject.subscribe(
      (data) => (this.numOfCompletedTasks = data)
    );

    this.getNumbers();
  }

  getNumbers(): void {
    this.api.getTasksFromList().subscribe((res) => {
      this.numOfTasks = res.length;
      this.numOfCompletedTasks = res.filter(
        (task: any) => task.completed == true
      ).length;
    });
  }
}
