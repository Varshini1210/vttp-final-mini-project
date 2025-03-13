import { User } from "@angular/fire/auth";


export interface LoginState {
    user: User | null;
    status: string
}