import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Chapter } from 'src/app/school/chapters/chapter';
import { Course } from 'src/app/school/courses/course';
import { MessageService } from 'src/app/services/message.service';
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
    private authService: AuthService,
    private notify: MessageService,
    public dialogRef: MatDialogRef<NpsSurveyComponent>
  ) { }

  saveResults(resultData: object, options: any): void {
    options.showSaveInProgress();
    this.surveyService
      .saveSurveyResults(resultData)
      .subscribe({
        next: data => {
          options.showSaveSuccess("Merci pour votre avis 🤗");
          // this.notify.openSnackBarSuccess("Merci pour votre avis!", "")
        },
        error: (err: HttpErrorResponse) => {
          options.showSaveError("Echec d'enregistrement, veuillez réessayer");
          // this.notify.openSnackBarError("Echec d'enregistrement, veuillez réessayer", "Ok")
        },
        complete: () => setTimeout(() => {
          this.dialogRef.close()
        }, 1500)
      })
  }

  surveyComplete(survey: any, options: any) {
    const userId = this.authService?.currentUsr?.id
    // survey.setValue("userId", userId);
    // survey.setValue("courseId", this.course.id);
    survey.setValue("chapterId", this.chapter.id);

    const surveyData = survey.data
    const recommendCourseValue = surveyData["recommendCourse"]

    if (recommendCourseValue !== undefined) {
      surveyData["recommendCourse"] = recommendCourseValue == "Oui" ? true : false
    }

    const dataToSend = {
      ...surveyData,
      recommendCourse: true,
      chapterUnderstandingScore: 5,
      favoriteLearningToolOfTheChapter: [],
      reasonFavoriteLearningToolOfTheChapter: "",
      overallChapterSatisfaction: 5,
      improvementSuggestion: "",
    }

    this.saveResults(dataToSend, options);
  }

  ngOnInit() {
    const survey = new Model(this.jsonSchema);
    this.surveyModel = survey;
    survey.onComplete.add((survey, options) => this.surveyComplete(survey, options));
  }

}
