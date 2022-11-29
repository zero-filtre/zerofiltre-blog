import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment } from '@angular/router';
import { LoadEnvService } from '../../services/load-env.service';
import { MessageService } from '../../services/message.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RouteGuard implements CanLoad {
  readonly isActive = environment.courseRoutesActive === 'true';

  constructor(
    private loadEnvService: LoadEnvService,
    private messageService: MessageService,
  ) { }

  canLoad(
    route: Route,
    segments: UrlSegment[]): boolean {

    if (this.isActive) {
      return true;
    } else {
      this.messageService.loadModuleError();
      return false
    }
  }
}
