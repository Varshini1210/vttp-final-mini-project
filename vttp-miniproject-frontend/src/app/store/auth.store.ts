import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { LoginState } from "../models/login-state";

const INIT_STATE: LoginState = {
    status: 'pending'
}

@Injectable()
export class AuthStore extends ComponentStore<LoginState> {

    constructor() {
        super(INIT_STATE)
    }

    readonly loginStatus$ = this.select((state) => state.status);

    


}