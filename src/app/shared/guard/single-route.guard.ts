import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LoadEnvService } from '../../services/load-env.service';
import { MessageService } from '../../services/message.service';

@Injectable({
  providedIn: 'root'
})
export class SingleRouteGuard implements CanActivate {
  readonly isActive = environment.courseRoutesActive;

  constructor(
    private loadEnvService: LoadEnvService,
    private messageService: MessageService,
  ) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (this.isActive) {
      return true;
    } else {
      this.messageService.loadModuleError();
      return false
    }
  }

}
