import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

const passwordsMatch = (ctrl: AbstractControl) => {

  const password = ctrl.get('password')?.value;
  const confirmPassword = ctrl.get('confirmPassword')?.value;
  if (password === confirmPassword){
    return null // return null if no error
  }
  return { passwordsMismatch: true } as ValidationErrors
}

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent implements OnInit{

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router =inject(Router)

  protected form!: FormGroup;
  protected errorMessage: string = '';

  ngOnInit(): void {
    this.form= this.createForm();
  }

  private createForm(): FormGroup {
    return this.form = this.fb.group({
      email: this.fb.control<string>('',[Validators.required, Validators.email]),
      password: this.fb.control<string>('', [Validators.required, Validators.minLength(8), Validators.pattern("^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$")]),
      confirmPassword: this.fb.control<string>('',[Validators.required, passwordsMatch ])
    })
  }

  protected backToLogin(){
    this.router.navigate(['/'])
  }

  get pristine() {
    return this.form.pristine
  }



  async onSubmit() {
    if (this.form.invalid) return;

    try {
      await this.authService.signUp(this.form.value.email, this.form.value.password);
      this.router.navigate(['/']);
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }

}
