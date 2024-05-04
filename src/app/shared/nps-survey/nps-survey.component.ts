import { Component, Input } from '@angular/core';
import { Model } from "survey-core";


@Component({
  selector: 'app-nps-survey',
  templateUrl: './nps-survey.component.html',
  styleUrls: ['./nps-survey.component.css']
})
export class NpsSurveyComponent {

  @Input() jsonData: string;
  surveyModel: Model;

  surveyJson = {
    elements: [
      {
        name: "FirstName",
        title: "Enter your first name:",
        type: "text"
      }, {
        name: "LastName",
        title: "Enter your last name:",
        type: "text"
      },
      {
        name: 'satisfaction',
        title: 'À quel point êtes-vous satisfait de notre plateforme ?',
        type: 'Rating'
      },
    ]
  };


  ngOnInit() {
    const survey = new Model(this.surveyJson);
    this.surveyModel = survey;
  }

}
