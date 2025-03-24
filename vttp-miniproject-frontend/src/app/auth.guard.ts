import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, CanDeactivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "./services/auth.service";
import { map } from "rxjs";
import { RegisterComponent } from "./components/register/register.component";

export const canProceedToHome: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.isAuthenticated().pipe(
        map(isAuth => {
            if(!isAuth) {
                router.navigate(['/']);
                return false;
            }
            return true;
        })
    )
    
}



export const cancelRegistration: CanDeactivateFn<RegisterComponent> = (form: RegisterComponent, route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {

    if (!form.pristine){
        return confirm('The data that you have entered will not be saved and you will not be registered. \nAre you sure you want to leave?')
    }
    return true;
}