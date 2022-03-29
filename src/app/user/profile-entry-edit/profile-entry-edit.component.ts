import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MessageService } from 'src/app/services/message.service';
import { SeoService } from 'src/app/services/seo.service';
import { AuthService } from '../auth.service';
import { User } from '../user.model';
import { Router } from '@angular/router';

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
      socialLinks: this.fb.array([
        this.fb.group({
          platform: ['TWITTER'],
          link: [this.user?.socialLinks[1].link],
        }),
        this.fb.group({
          platform: ['GITHUB'],
          link: [this.user?.socialLinks[2].link],
        }),
        this.fb.group({
          platform: ['STACKOVERFLOW'],
          link: [this.user?.socialLinks[0].link],
        }),
      ])
    })
  }

  get profession() { return this.form.get('profession'); }
  get pseudo() { return this.form.get('pseudo'); }
  get fullName() { return this.form.get('fullName'); }
  get bio() { return this.form.get('bio'); }
  get website() { return this.form.get('website'); }
  get socialLinks() { return this.form.get('socialLinks') as FormArray }

  public setFormUserInfos() {
    this.setUserSocialLinks();
  }

  public setUserSocialLinks(): any {
    this.socialLinks.controls.forEach((formGroup: any, id: any) => {
      // formGroup.controls['link'].setValue('the user link');
    });
  }

  public getUserProfile(): void {
    this.authService.findUserProfile(this.user?.id!).subscribe({
      next: (response: User) => {
        this.user = response
        this.fullName?.setValue(this.user.fullName)
        this.profession?.setValue(this.user.profession)
        this.socialLinks?.setValue(this.user.socialLinks)
      },
      error: (error: HttpErrorResponse) => {
        console.log('Error  Profile: ', error);
      }
    })
  }

  public updateUserInfos(): void {
    this.loading = true;

    this.authService.updateUserProfile(this.form.value).subscribe({
      next: (response: User) => {
        this.loading = false;
        this.messageService.openSnackBarSuccess('Enregistrement reussi !', 'Ok', 0);
        this.authService.setUserData(response)
        console.log('UPDATED USER: ', response);
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        console.log('UPDATE USER ERROR: ', error);
      }
    })
  }

  ngOnInit(): void {
    this.user = this.authService?.currentUsr

    this.InitForm();
    this.setFormUserInfos();

    console.log('SOCIAL LINKS: ', this.socialLinks);
    console.log('USER SOCIAL LINKS: ', this.user?.socialLinks);

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
