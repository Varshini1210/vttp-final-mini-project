import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Auth, User ,createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom, lastValueFrom, Observable } from 'rxjs';
import { Patient } from '../models';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth = inject(Auth);
  private router = inject(Router);
  private http =inject(HttpClient);

  patient: Patient = {
    username: '',
    email: '',
    bookingStatus: false,
    user_id:''
  }

  private userSubject= new BehaviorSubject<User | null>(null);
  user$: Observable<User | null> = this.userSubject.asObservable();

  constructor() {
    //Listen for auth state changes
    onAuthStateChanged(this.auth, (user) => {
      this.userSubject.next(user);
    })
  }

  // Sign up new users and send verification email
  async signUp(email: string, password: string, username: string): Promise<void> {
    try{ 

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username }),
      });

        if (!response.ok) {
          throw new Error('Error registering user');
        }
        
        const userCredential = await signInWithEmailAndPassword(this.auth, email, password);

        if (userCredential.user && !userCredential.user.emailVerified) {
          // Send email verification if not already verified
          await sendEmailVerification(userCredential.user);
          alert('Verification email sent. Please check your inbox.');
  
          await signOut(this.auth);
      }
    }
    catch(error: any) {
      alert(error.message);
    }
  }

  async login(email:string, password: string): Promise<string> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);

      if (!userCredential.user.emailVerified){
        await signOut(this.auth);
        throw new Error('Email not verified. Please check your inbox');
      }
 
      const idToken = await userCredential.user.getIdToken();

      return await this.sendTokenToBackend(idToken);
      
    }
    catch (error: any) {
      throw new error(error.message);
    }
  }

  private sendTokenToBackend(idToken: string): Promise<string> {
    return lastValueFrom(
      this.http.post<{ user_type: string; username: string; email: string; user_id: string }>('/api/authenticate', { token: idToken })
    ).then(response => {
     
      this.patient.username=response.username;
      this.patient.email=response.email
      this.patient.user_id = response.user_id
      return response.user_type; 
    }).catch(error => {
      console.error("Error sending token to backend:", error.message);
      throw new Error("Authentication Failed");
    });
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.userSubject.next(null);
      this.router.navigate(['/login']);
    }
    catch(error: any){
      throw new error(error.message);
    }
  }

  isAuthenticated(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.user$.subscribe((user) => {
        observer.next(!!user);
      });
    });
  }

  getPatient(): Patient {
    return this.patient
  }

 


}
