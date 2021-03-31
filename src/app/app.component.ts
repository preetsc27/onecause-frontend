import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Onecause';
  apiErr: string
  apiSuccessMsg: string
  loading = false
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    ott: new FormControl('', [Validators.required, this.ottAllNumberValidation(), Validators.minLength(4), Validators.maxLength(4)]),
  })

  ottAllNumberValidation(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (/^\d+$/.test(control.value) === false) return { allNumbers: true }
      return null
    }
  }


  constructor(private _http: HttpClient) { }

  // convenience getter for easy access to form fields
  get formControls() { return this.loginForm.controls; }

  ngOnInit() {
    this.resetApiErr("username")
    this.resetApiErr("password")
    this.resetApiErr("ott")
  }

  resetApiErr(key: string) {
    this.formControls[key].valueChanges.subscribe(_ => {
      this.apiErr = undefined
    })
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true
      const data = {
        username: this.formControls["username"].value,
        password: this.formControls["password"].value,
        ott: this.formControls["ott"].value,
      }
      console.log(data)
      const url = "/apiv1/login"
      this._http.post(url, JSON.stringify(data))
        .subscribe((res) => {
          console.log(res)
          this.apiSuccessMsg = "You are successfully logged in"
          this.loading = false
          window.open("https://www.onecause.com/", "_self")
        }, (err: any) => {
          console.log(err?.error?.error ?? "Some error")
          this.apiErr = err?.error?.error ?? "Some error occured"
          this.loading = false

        })
    }
  }
}
