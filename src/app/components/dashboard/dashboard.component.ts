import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { List } from 'src/app/models/List';
import { Task } from 'src/app/models/Task';
import { ApiService } from 'src/app/services/api.service';
import { duplicateValidator } from 'src/app/validators/duplicate.validator';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  taskForm!: FormGroup;
  showErrorMessages: boolean = false; // form validation error messages

  lists: List[] = [];
  tasks: Task[] = [];
  selectedList!: List;

  constructor(private fBuilder: FormBuilder, private api: ApiService) {}

  ngOnInit(): void {
    this.taskForm = this.fBuilder.group({
      taskTitle: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z ]*$')], // sync - required && text only
        [duplicateValidator(this.api)], // async - duplicate
      ],
    });

    this.getAllLists();
  }

  // add task to the selected list
  // update lists with updated selected list
  addTask(valid: boolean) {
    let newTaskTitle = this.taskForm.value.taskTitle;

    // if form is valid
    if (valid) {
      let newTask = new Task();
      newTask.title = newTaskTitle;
      newTask.completed = false;
      newTask.id = this.selectedList.tasks.length;
      this.selectedList.tasks.push(newTask);

      this.api.updateList(this.selectedList).subscribe(
        (res) => {
          this.taskForm.reset();
          this.getAllLists(this.selectedList.id);
        },
        (err) => {
          // console.log('add task error');
        }
      );
    }
  }

  // remove task from selected list
  // update lists with updated selected list
  deleteTask(taskId: number) {
    this.selectedList.tasks = this.selectedList.tasks.filter(
      (task) => task.id != taskId
    );

    this.api.updateList(this.selectedList).subscribe(
      (res) => {
        this.getAllLists(this.selectedList.id);
      },
      (err) => {
        // console.log('delete task error');
      }
    );
  }

  // replace task with an updated task in selected list
  // update lists with updated selected list
  updateTask(taskData: Task) {
    this.selectedList.tasks.map((el) => {
      return el.id === taskData.id ? taskData : el;
    });
    this.api.updateList(this.selectedList).subscribe(
      (res) => {
        this.getAllLists(res.id);
      },
      (err) => {
        console.log('update task error');
      }
    );
  }

  // get all lists
  getAllLists(selectId: number = 0) {
    this.api.getList().subscribe((res) => {
      this.lists = res;
      this.selectList(selectId);
    });
  }

  // when tab clicked, set selected list
  // update displayed tasks
  // update selectedListId behavior subject
  // update footer attributes (also behavior subjects)
  selectList(index: number) {
    this.lists.map((list) => {
      list.selected = false;
    });

    this.lists[index].selected = true;
    this.selectedList = this.lists[index];
    this.tasks = this.selectedList.tasks;

    this.api.selectedListId.next(this.selectedList.id);
    this.api.updateNumbers(
      this.tasks.length,
      this.tasks.filter((task) => task.completed).length
    );
  }

  // prompt for new list title
  // create new default list
  // api post list to db.json
  //
  createNewList() {
    let newTitle;
    if ((newTitle = prompt('Enter new list title:'))) {
      const newList = new List();
      newList.title = newTitle;
      newList.selected = true;
      newList.tasks = [];

      this.api.postList(newList).subscribe(
        (res) => {
          this.selectedList = res; // select list when its created
          this.getAllLists(this.selectedList.id);
        },
        (err) => {
          // show error
        }
      );
    }
  }

  // find list with index in this.lists
  // api delete list from db.json
  deleteList(index: number) {
    let delList = this.lists[index];
    this.api.deleteList(delList.id).subscribe((res) => {
      this.getAllLists();
    });
  }

  // update footer numbers
  updateNumbers(total: number, completed: number): void {
    this.api.numOfTasksBSubject.next(total);
    this.api.numOfCompletedTasksBSubject.next(completed);
  }
}
