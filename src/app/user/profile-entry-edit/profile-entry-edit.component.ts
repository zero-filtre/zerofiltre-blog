import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private seo: SeoService
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

      // socialLinks: this.fb.array(
      // [
      //   this.fb.group({
      //     platform: ['TWITTER'],
      //     link: [this.user?.socialLinks.find((profile: any) => profile.platform === 'TWITTER')?.link],
      //     userId: [this.user?.id]
      //   }),
      //   this.fb.group({
      //     platform: ['GITHUB'],
      //     link: [this.user?.socialLinks.find((profile: any) => profile.platform === 'GITHUB')?.link],
      //     userId: [this.user?.id]
      //   }),
      //   this.fb.group({
      //     platform: ['STACKOVERFLOW'],
      //     link: [this.user?.socialLinks.find((profile: any) => profile.platform === 'STACKOVERFLOW')?.link],
      //     userId: [this.user?.id]
      //   }),
      // ]
      // []
      // )

      twitterLink: [this.user?.socialLinks.find((profile: any) => profile.platform === 'TWITTER')?.link],
      githubLink: [this.user?.socialLinks.find((profile: any) => profile.platform === 'GITHUB')?.link],
      soLink: [this.user?.socialLinks.find((profile: any) => profile.platform === 'STACKOVERFLOW')?.link],
      socialLinks: [[]]
    })
  }

  get profession() { return this.form.get('profession'); }
  get pseudo() { return this.form.get('pseudo'); }
  get fullName() { return this.form.get('fullName'); }
  get bio() { return this.form.get('bio'); }
  get website() { return this.form.get('website'); }
  get twitterLink() { return this.form.get('twitterLink'); }
  get githubLink() { return this.form.get('githubLink'); }
  get soLink() { return this.form.get('soLink'); }
  get socialLinks() { return this.form.get('socialLinks')! }
  // get socialLinks() { return this.form.get('socialLinks') as FormArray }

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
  //     if (sl.link) this.addSocialLink(sl)
  //   })
  // }

  public setUserSocialLinksBeforeUpdateRequest() {
    const socialLinks = this.socialLinks.value
    let realSocialLinksValue;

    // socialLinks.forEach((sl: any, id: any) => {
    //   if (!sl.link) this.removeSocialLink(id)
    // })

    // realSocialLinksValue = socialLinks.filter((sl: any) => sl.link)

    const links = [this.twitterLink, this.githubLink, this.soLink]
    const linksToSend = links.filter((li: any) => li.value).map((li: any) => {
      let obj;
      obj = {
        platform: 'plat',
        link: li.value,
        userId: this.user?.id
      }
      return obj;
    })

    // this.form.removeControl('twitterLink')
    // this.form.removeControl('githubLink')
    // this.form.removeControl('soLink')

    this.form.patchValue({ socialLinks: linksToSend })
  }

  public updateUserInfos(): void {
    this.loading = true;
    this.setUserSocialLinksBeforeUpdateRequest();

    console.log('FORM VALUE: ', this.form.value);
    // return

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

  public getUserProfile(): void {
    this.authService.findUserProfile(this.user?.id!).subscribe({
      next: (response: User) => {
        this.user = response
        this.fullName?.setValue(this.user.fullName)
        this.profession?.setValue(this.user.profession)
        this.socialLinks?.setValue(this.user.socialLinks)
      },
      error: (_error: HttpErrorResponse) => {
      }
    })
  }

  ngOnInit(): void {
    this.user = this.authService?.currentUsr

    this.InitForm();

    // this.getUserSocialLinks();

    this.seo.generateTags({
      title: "Modifier son profil | Zerofiltre.tech",
      description: "Développez des Apps à valeur ajoutée pour votre business et pas que pour l'IT. Avec Zerofiltre, profitez d'offres taillées pour chaque entreprise. Industrialisez vos Apps. Maintenance, extension, supervision.",
      author: 'Zerofiltre.tech',
      type: 'website',
      image: 'https://i.ibb.co/p3wfyWR/landing-illustration-1.png'
    });
  }

  ngOnDestroy(): void {
    this.loading = false;
  }

}
