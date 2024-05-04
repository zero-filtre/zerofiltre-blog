import { Component, Input } from '@angular/core';
import { SurveyService } from 'src/app/services/survey.service';
import { AuthService } from 'src/app/user/auth.service';
import { Model } from "survey-core";

const SURVEY_ID = 1;

@Component({
  selector: 'app-nps-survey',
  templateUrl: './nps-survey.component.html',
  styleUrls: ['./nps-survey.component.css']
})
export class NpsSurveyComponent {

  @Input() jsonSchema: object;
  saving: boolean;
  completed: boolean;
  surveyModel: Model;

  constructor(
    private surveyService: SurveyService,
    private authService: AuthService
  ) { }

  surveyJson = {
    elements: [
      {
        name: "FirstName",
        title: "Entrez votre nom:",
        type: "text"
      }, {
        name: "LastName",
        title: "Entrez votre prénom:",
        type: "text"
      },
      {
        name: 'Satisfaction',
        title: 'À quel point êtes-vous satisfait de notre plateforme ?',
        type: 'rating'
      },
    ]
  };

  saveResults(surveyData: object): void {
    this.saving = true;
    this.surveyService
      .saveSurveyResults(surveyData)
      .subscribe(data => {
        alert(data)
        console.log('SURVEY RESULT: ', data)
        this.saving = false;
      })
  }

  surveyComplete (survey: any) {
    const userId = this.authService?.currentUsr?.id
    survey.setValue("userId", userId);
    this.saveResults(survey.data)
  }

  ngOnInit() {
    const survey = new Model(this.surveyJson);
    this.surveyModel = survey;
    survey.onComplete.add(this.surveyComplete);
  }

}
