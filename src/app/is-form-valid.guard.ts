import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseComponent } from './Base.component';
import { MessageService } from './services/message.service';

@Injectable({
  providedIn: 'root'
})
export class IsFormValidGuard implements CanDeactivate<BaseComponent> {
  constructor(private messageService: MessageService) { }

  canDeactivate(
    component: BaseComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // return component.isFormValid() ? true : this.messageService.autoSaveAlert();

    return component.isFormValid() ? true : window.confirm("Vos changements seront perdus ! souhaittez-vous quitter cette page ?")
  }

}
