import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { CustomValidators } from "./custom-validators";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  projectForm: FormGroup;
  projectStatus = ["stable", "critical", "finished"];
  forbiddenProjectNames = ["Test"];

  ngOnInit(): void {
    this.projectForm = new FormGroup({
      ["projectName"]: new FormControl(
        null,
        [Validators.required, CustomValidators.invalidProjectName],
        CustomValidators.invalidProjectNameAsync
      ),
      ["email"]: new FormControl(null, [Validators.required, Validators.email]),
      ["projectStatus"]: new FormControl(null),
    });
  }

  onSubmit() {
    console.log(this.projectForm.value);

    this.projectForm.reset();
  }

  // this is our custom validator method:
  forbiddenNames(control: FormControl): { [s: string]: boolean } {
    if (this.forbiddenProjectNames.indexOf(control.value) !== -1) {
      return { projectNameIsForbidden: true };
    }
    return null;
  }

  // asynchronous validator: waiting for response from a timer (i.e. mock web server), if valid or not:
  forbiddenNamesAsync(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise<any>((resolve) => {
      setTimeout(() => {
        if (control.value === "Test") {
          resolve({ "This project name is forbidden": true });
        } else {
          resolve(null);
        }
      }, 1500);
    });

    return promise;
  }
}
