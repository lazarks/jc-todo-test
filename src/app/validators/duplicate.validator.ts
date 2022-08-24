import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { map } from 'rxjs';
import { Task } from '../models/Task';
import { ApiService } from '../services/api.service';

export function duplicateValidator(api: ApiService): AsyncValidatorFn {
  return (control: AbstractControl) => {
    return api.getTasksFromList().pipe(
      map((tasks) => {
        const task = tasks.find(
          (task: Task) =>
            task.title.toLowerCase() == control.value.toLowerCase()
        );
        return task ? { titleExists: true } : null;
      })
    );
  };
}
