import { Component, inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WebSocketService } from '../../services/web-socket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-home',
  standalone: false,
  templateUrl: './admin-home.component.html',
  styleUrl: './admin-home.component.css'
})
export class AdminHomeComponent implements OnInit {

  notifications: string[] = [];


  private websocketSvc = inject(WebSocketService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router)

  ngOnInit(): void {
    this.websocketSvc.getAdminNotifications().subscribe((message) => {
      if (message) {
        this.notifications=[...this.notifications,message]; 
      }
    });
  }

  clearAllNotifications(): void {
    this.notifications = [];
    this.snackBar.open('All notifications cleared', 'Dismiss', {
      duration: 3000
    })
  }

  logout(): void {
    
    console.log('Admin logged out');
    this.router.navigate(['/']);
    
  }
  
}
