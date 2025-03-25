import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatButtonModule,
    MatSelectModule
  ],
  exports:[
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatButtonModule,
    MatSelectModule
  ]
})
export class MaterialModule { }
