import { Task } from './Task';

// List class has a role of a navigation tab
// that containts tasks
export class List {
  id: number = 0;
  title: string = '';
  selected: boolean = false;
  tasks: Task[] = [];
}
