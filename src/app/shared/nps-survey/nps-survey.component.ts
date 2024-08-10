import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { Chapter } from 'src/app/school/chapters/chapter';
import { Course } from 'src/app/school/courses/course';
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
  @Input() course: Course;
  @Input() chapter: Chapter;

  saving: boolean;
  completed: boolean;
  surveyModel: Model;

  constructor(
    private surveyService: SurveyService,
    private authService: AuthService
  ) { }

  saveResults(resultData: object, options: any): void {
    options.showSaveInProgress();
    this.surveyService
      .saveSurveyResults(resultData)
      .subscribe({
        next: data => {
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
    survey.setValue("courseId", this.course.id);
    survey.setValue("chapterId", this.chapter.id);

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
    const survey = new Model(this.jsonSchema);
    this.surveyModel = survey;
    survey.onComplete.add((survey, options) => this.surveyComplete(survey, options));
  }

}
