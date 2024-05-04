import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { SurveyService } from 'src/app/services/survey.service';
import { AuthService } from 'src/app/user/auth.service';
import { Model } from "survey-core";

// const SURVEY_ID = 1;

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
        name: "firstName",
        title: "Entrez votre nom:",
        type: "text",
        defaultValue: 'Jason'
      }, {
        name: "lastName",
        title: "Entrez votre prénom:",
        type: "text",
        defaultValue: 'Derulo'
      },
      {
        name: 'satisfaction',
        title: 'À quel point êtes-vous satisfait de notre plateforme ?',
        type: 'rating',
        defaultValue: '5'
      },
      {
        name: "subscribed",
        type: "boolean",
        renderAs: "checkbox",
        title: "I agree to receive weekly newsletters 2",
      },
      {
        name: "start-date",
        title: "Select a vacation start date",
        type: "text",
        inputType: "date",
        defaultValueExpression: "today()"
      },
      {
        type: "rating",
        name: "nps_score",
        title: "On a scale of zero to ten, how likely are you to recommend our product to a friend or colleague?",
        rateMin: 0,
        rateMax: 10,
      }
      // {
      //   "name": "subscribed",
      //   "type": "checkbox",
      //   "title": "I agree to receive weekly newsletters 1",
      //   "defaultValue": true
      // },
    ]
  };

  saveResults(resultData: object, options: any): void {
    options.showSaveInProgress();
    this.surveyService
      .saveSurveyResults(resultData)
      .subscribe({
        next: data => {
          alert(data)
          options.showSaveSuccess("Enregistré avec succès!");
        },
        error: (err: HttpErrorResponse) => {
          console.error(err);
          options.showSaveError("Echec d'enregistrement");
        }
      })
  }

  surveyComplete(survey: any, options: any) {
    const userId = this.authService?.currentUsr?.id
    survey.setValue("userId", userId);

    //   const resultData = Object.keys(survey.data)
    //     .map((key: string) => {
    //       const question = survey.getQuestionByName(key);
    //       if (!!question) {
    //         return ({
    //           name: key,
    //           value: question.value,
    //           title: question.displayValue,
    //           displayValue: question.displayValue
    //         })
    //       }
    //       return null
    //     }).filter(item => item !== null);

    const resultData = survey.data

    this.saveResults(resultData, options);
  }

  ngOnInit() {
    const survey = new Model(this.surveyJson);
    this.surveyModel = survey;
    survey.onComplete.add((survey, options) => this.surveyComplete(survey, options));
  }

}
