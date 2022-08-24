import { Task } from './Task';

export class List {
  id: number = 0;
  title: string = '';
  selected: boolean = false;
  tasks: Task[] = [];
}
