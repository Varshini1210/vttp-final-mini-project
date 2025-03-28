import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { cancelRegistration, canProceedToHome } from './auth.guard';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { QueueConfirmationComponent } from './components/queue-confirmation/queue-confirmation.component';

const routes: Routes = [
  {path:'', component:LoginComponent},
  {path:'register', component:RegisterComponent},
  {path:'home', component:HomeComponent},
  {path:'adminhome',component:AdminHomeComponent},
  {path:'confirmation', component:QueueConfirmationComponent},
  {path:'**', redirectTo:'/', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
