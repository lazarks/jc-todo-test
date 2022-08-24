import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task } from 'src/app/models/Task';
import { ApiService } from 'src/app/services/api.service';
import { duplicateValidator } from 'src/app/validators/duplicate.validator';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit {
  @Input() taskData!: any;
  editMode: boolean = false;
  editForm!: FormGroup;
  @ViewChild('newTitle') editTitleInputElement!: ElementRef<HTMLInputElement>;

  @Output('deleteTaskEvent') deleteTaskEvent: EventEmitter<number> =
    new EventEmitter();
  @Output('updateTaskEvent') updateTaskEvent: EventEmitter<Task> =
    new EventEmitter();

  constructor(private fBuilder: FormBuilder, private api: ApiService) {}

  ngOnInit(): void {
    this.editForm = this.fBuilder.group({
      newTitle: [
        this.taskData.title,
        [Validators.required, Validators.pattern('^[a-zA-Z ]*$')], // sync
        [duplicateValidator(this.api)], // async
      ],
    });
  }

  handleBlur() {
    setTimeout(() => {
      this.editMode = false;
    }, 100);
  }

  editButtonFunc() {
    this.editMode = true;

    setTimeout(() => {
      this.editTitleInputElement.nativeElement.focus();
    }, 100);
  }

  // UPDATE checkbox -- task completed
  toggleCompleted() {
    this.taskData.completed = !this.taskData.completed;
    this.updateTaskEvent.emit(this.taskData);
  }

  // UPDATE text input - task title
  editTask(valid: boolean) {
    if (valid) {
      this.taskData.title = this.editForm.value.newTitle;
      this.updateTaskEvent.emit(this.taskData);
    }
  }

  // DELETE
  deleteTask() {
    this.deleteTaskEvent.emit(this.taskData.id);
  }
}
