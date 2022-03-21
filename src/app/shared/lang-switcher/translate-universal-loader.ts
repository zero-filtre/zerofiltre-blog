import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { en } from 'src/assets/i18n/en';
import { fr } from 'src/assets/i18n/fr';

export class TranslateUniversalLoader implements TranslateLoader {
    public getTranslation(lang: string): Observable<any> {
        return new Observable((observer: any) => {
            if (lang === 'fr') {
                observer.next(fr);
            } else {
                observer.next(en);
            }
            observer.complete();
        });
    }
}