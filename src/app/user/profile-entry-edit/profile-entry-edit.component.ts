import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'src/app/services/message.service';
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
  private formToSend = {};

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private seo: SeoService,
    private translate: TranslateService
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
        // []
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
    if (!link.match(/^https:\/\//)) return true;
    return false
  }

  public userHasSocialLinkFor(platform: string): boolean {
    return this.user?.socialLinks.some((profile: any) => profile.platform === platform && profile.link)
  }

  // public addSocialLink(obj: any) {
  //   this.socialLinks.push(
  //     this.fb.group({
  //       platform: [obj.platform],
  //       link: [obj.link],
  //       userId: [obj.userId]
  //     })
  //   );
  // }

  // public removeSocialLink(id: any) {
  //   this.socialLinks.removeAt(id)
  // }

  // public getUserSocialLinks(): any {
  //   this.user?.socialLinks.forEach((sl: any) => {
  //     // if (sl.link) this.addSocialLink(sl)
  //     this.addSocialLink(sl)
  //   })
  // }

  public setUserSocialLinksBeforeUpdateRequest(): boolean {
    const socialLinks = this.socialLinks.value
    let isOk = true;
    const realLinks = []

    socialLinks.forEach((fg: any, id: any) => {
      if (fg.link) {
        realLinks.push(fg.link)
        // this.removeSocialLink(id)
      } else if (this.invalidLink(fg.link)) {
        this.messageService.badSocialLinksFormat();
        isOk = false;
      }
    })
    return isOk
  }

  public updateUserInfos(): void {
    if (!this.setUserSocialLinksBeforeUpdateRequest()) return;

    this.formToSend = { ...this.form.value }
    // this.formToSend.socialLinks = 

    console.log('FORM VALUE: ', this.form.value);
    // return

    this.loading = true;
    this.authService.updateUserProfile(this.form.value).subscribe({
      next: (response: User) => {
        this.loading = false;
        this.messageService.updateProfileSuccess();
        this.authService.setUserData(response)
      },
      error: (_error: HttpErrorResponse) => {
        this.loading = false;
      }
    })
  }


  ngOnInit(): void {
    this.user = this.authService?.currentUsr

    this.InitForm();
    // this.getUserSocialLinks();

    this.seo.generateTags({
      title: this.translate.instant('meta.profileEditTitle'),
      description: this.translate.instant('meta.profileEditDescription'),
      author: 'Zerofiltre.tech',
      type: 'website',
      image: 'https://i.ibb.co/p3wfyWR/landing-illustration-1.png'
    });
  }

  ngOnDestroy(): void {
    this.loading = false;
  }

}
