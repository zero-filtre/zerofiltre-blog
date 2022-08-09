import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoadEnvService } from 'src/app/services/load-env.service';
import { MessageService } from 'src/app/services/message.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { SeoService } from 'src/app/services/seo.service';
import { AuthService } from '../auth.service';
import { User } from '../user.model';

@Component({
  selector: 'app-profile-entry-edit',
  templateUrl: './profile-entry-edit.component.html',
  styleUrls: ['./profile-entry-edit.component.css']
})
export class ProfileEntryEditComponent implements OnInit {
  public user!: User;
  public form!: FormGroup;
  public loading: boolean = false;
  private dataToSend!: User;

  constructor(
    private loadEnvService: LoadEnvService,
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private seo: SeoService,
    private translate: TranslateService,
    public navigate: NavigationService,
    private router: Router
  ) { }

  public InitForm(): void {
    this.form = this.fb.group({
      id: [this.user?.id],
      language: ['fr'],
      fullName: [this.user?.fullName, [Validators.required]],
      profession: [this.user?.profession],
      profilePicture: [this.user?.profilePicture],
      bio: [this.user?.bio],
      website: [this.user?.website],
      pseudo: [this.user?.pseudoName],

      socialLinks: this.fb.array(
        [
          this.fb.group({
            platform: ['TWITTER'],
            link: [this.user?.socialLinks.find((profile: any) => profile.platform === 'TWITTER')?.link],
            userId: [this.user?.id]
          }),
          this.fb.group({
            platform: ['GITHUB'],
            link: [this.user?.socialLinks.find((profile: any) => profile.platform === 'GITHUB')?.link],
            userId: [this.user?.id]
          }),
          this.fb.group({
            platform: ['STACKOVERFLOW'],
            link: [this.user?.socialLinks.find((profile: any) => profile.platform === 'STACKOVERFLOW')?.link],
            userId: [this.user?.id]
          }),
        ]
      )
    })
  }

  get profession() { return this.form.get('profession'); }
  get pseudo() { return this.form.get('pseudo'); }
  get fullName() { return this.form.get('fullName'); }
  get bio() { return this.form.get('bio'); }
  get website() { return this.form.get('website'); }
  get socialLinks() { return this.form.get('socialLinks') as FormArray }

  public invalidLink(link: string): boolean {
    if (!link?.match(/^https:\/\//)) return true;
    return false
  }

  public isValidHttpUrl(link: string) {
    let url;

    try {
      url = new URL(link);
    } catch (_) {
      return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
  }

  public userHasSocialLinkFor(platform: string): boolean {
    return this.user?.socialLinks.some((profile: any) => profile.platform === platform && profile.link)
  }

  public validateUserSocialLinksBeforeUpdateRequest(): boolean {
    const socialLinks = this.socialLinks.value
    const realLinks = <any>[]
    let isOk = true;

    socialLinks.forEach((fg: any) => {
      if (fg.link && !this.invalidLink(fg.link)) {
        realLinks.push(fg)
      } else if (fg.link && this.invalidLink(fg.link)) {
        this.messageService.badSocialLinksFormat();
        isOk = false;
      }
    })

    this.dataToSend = { ...this.form.value }
    this.dataToSend.socialLinks = realLinks
    return isOk
  }

  public updateUserInfos(): void {
    if (!this.validateUserSocialLinksBeforeUpdateRequest()) return;

    this.loading = true;

    this.authService.updateUserProfile(this.dataToSend).subscribe({
      next: (response: User) => {
        this.loading = false;
        this.messageService.updateProfileSuccess();
        this.authService.setUserData(response)
        this.router.navigateByUrl('/user/profile');
      },
      error: (_error: HttpErrorResponse) => {
        this.loading = false;
      }
    })
  }


  ngOnInit(): void {
    this.user = this.authService?.currentUsr

    this.InitForm();

    this.seo.generateTags({
      title: this.translate.instant('meta.profileEditTitle'),
      description: this.translate.instant('meta.profileEditDescription'),
      author: 'Zerofiltre.tech',
      image: 'https://i.ibb.co/p3wfyWR/landing-illustration-1.png'
    });
  }

  ngOnDestroy(): void {
    this.loading = false;
  }

}
