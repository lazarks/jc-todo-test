import { Component, OnInit } from '@angular/core';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  // footer parameters
  numOfTasks: number = 0;
  numOfCompletedTasks: number = 0;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.numOfTasksBSubject.subscribe((data) => (this.numOfTasks = data));
    this.api.numOfCompletedTasksBSubject.subscribe(
      (data) => (this.numOfCompletedTasks = data)
    );
  }
}
