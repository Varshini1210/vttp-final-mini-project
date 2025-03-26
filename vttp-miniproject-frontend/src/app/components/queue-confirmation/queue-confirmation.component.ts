import { Component, inject, OnInit } from '@angular/core';
import { BookingConfirmation } from '../../models';
import { QueueService } from '../../services/queue.service';

@Component({
  selector: 'app-queue-confirmation',
  standalone: false,
  templateUrl: './queue-confirmation.component.html',
  styleUrl: './queue-confirmation.component.css'
})
export class QueueConfirmationComponent {

  private queueSvc = inject(QueueService)


  bookingDetails = this.queueSvc.getClinicBooking()

   

}
