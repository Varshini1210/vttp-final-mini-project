import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router)

  protected form!: FormGroup;
  protected errorMessage: string = '';

  ngOnInit(): void {
    this.form= this.createForm();
  }

  private createForm(): FormGroup {
    return this.form = this.fb.group({
      email: this.fb.control<string>('',[Validators.required, Validators.email]),
      password: this.fb.control<string>('', [Validators.required])
    })
  }

  protected goToRegister() {
    this.router.navigate(['/register'])
  }

  


  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      return;
    }

    try {
      const userType : string = await this.authService.login(this.form.value.email, this.form.value.password);
      
      if (userType === 'PATIENT') {
        this.router.navigate(['/home']);
      }
      else if (userType === 'ADMIN') {
        this.router.navigate(['/adminhome'])
      }
      else {
        this.router.navigate(['/login']);
      }
      
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }

  

}
