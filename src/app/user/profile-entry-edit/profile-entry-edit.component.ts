import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
    private router: Router,
    private formuilder: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private seo: SeoService
  ) { }

  public InitForm(): void {
    this.form = this.formuilder.group({
      fullName: ['', [Validators.required]],
      profession: ['', []],
      bio: ['', []],
      website: ['', []],
      pseudo: ['', []],
      socialNetworks: [[]],
    })
  }

  get profession() { return this.form.get('profession'); }
  get pseudo() { return this.form.get('pseudo'); }
  get fullName() { return this.form.get('fullName'); }
  get bio() { return this.form.get('bio'); }
  get website() { return this.form.get('website'); }
  get socialLinks() { return this.form.get('socialLinks'); }

  public setFormUserInfos() {
    this.fullName?.setValue(this.user?.fullName)
    this.profession?.setValue(this.user?.profession)
    this.bio?.setValue(this.user?.bio)
    this.website?.setValue(this.user?.website)
    this.pseudo?.setValue(this.user?.pseudoName)
    this.socialLinks?.setValue(this.user?.socialLinks)
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

    return
    this.authService.signup(this.form.value).subscribe({
      next: (_response: any) => {
        this.messageService.signUpSuccess();
      },
      error: (_error: HttpErrorResponse) => {
        this.loading = false;
      }
    })
  }

  ngOnInit(): void {
    this.user = this.authService?.currentUsr

    // this.getUserProfile();
    this.InitForm();
    this.setFormUserInfos();

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
