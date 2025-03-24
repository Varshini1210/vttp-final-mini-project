import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Auth, User ,createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, firstValueFrom, lastValueFrom, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth = inject(Auth);
  private router = inject(Router);
  private http =inject(HttpClient)

  private userSubject= new BehaviorSubject<User | null>(null);
  user$: Observable<User | null> = this.userSubject.asObservable();

  constructor() {
    //Listen for auth state changes
    onAuthStateChanged(this.auth, (user) => {
      this.userSubject.next(user);
    })
  }

  // Sign up new users and send verification email
  async signUp(email: string, password: string): Promise<void> {
    try{ 
      // const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      // if (userCredential.user) {
      //   await sendEmailVerification(userCredential.user); // Send verification email
      //   await signOut(this.auth); // Sign out to prevent unverified login

      //   const idToken = await userCredential.user.getIdToken();

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

        if (!response.ok) {
          throw new Error('Error registering user');
        }
        
        const userCredential = await signInWithEmailAndPassword(this.auth, email, password);

        if (userCredential.user && !userCredential.user.emailVerified) {
          // Send email verification if not already verified
          await sendEmailVerification(userCredential.user);
          alert('Verification email sent. Please check your inbox.');
  
          // Optionally sign out the user after sending the verification email to prevent access to unverified users
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

      // this.userSubject.next(userCredential.user);
      
    }
    catch (error: any) {
      throw new error(error.message);
    }
  }

  private sendTokenToBackend(idToken: string): Promise<string> {
   return lastValueFrom(this.http.post<{ user_type: string }>('/api/authenticate', { token: idToken}))
                .then(response => response?.user_type || '')
                .catch(error => {
                  console.error("Error sending token to backend:", error.message);
                  throw new error("Authentication Failed");
                })
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
}
