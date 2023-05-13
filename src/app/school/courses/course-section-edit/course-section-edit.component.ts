import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Section } from '../course';
import { catchError, Subject, throwError } from 'rxjs';
import { SectionService } from '../../sections/section.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-course-section-edit',
  templateUrl: './course-section-edit.component.html',
  styleUrls: ['./course-section-edit.component.css']
})
export class CourseSectionEditComponent implements OnInit {
  sectionData: Section;
  form!: FormGroup;
  uploading: boolean;
  loading: boolean
  prevPos: number;
  sections: Section[];
  courseID: number;

  public EditorText$ = new Subject<string>();

  constructor(
    public dialogRef: MatDialogRef<CourseSectionEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private sectionService: SectionService,
    private messageService: MessageService
  ) { }

  initForm(section: Section) {
    if (section == null) {
      this.form = this.fb.group({
        position: [section?.position, [Validators.required]],
        title: [section?.title, [Validators.required]],
        content: [section?.content, [Validators.required]],
        image: [section?.image, [Validators.required]],
        courseId: [this.courseID],
      })
    } else {
      this.form = this.fb.group({
        id: [section?.id],
        position: [section?.position, [Validators.required]],
        title: [section?.title, [Validators.required]],
        content: [section?.content, [Validators.required]],
        image: [section?.image, [Validators.required]],
        courseId: [section?.courseId],
      })
    }
  }

  get id() { return this.form.get('id'); }
  get position() { return this.form.get('position'); }
  get title() { return this.form.get('title'); }
  get content() { return this.form.get('content'); }
  get image() { return this.form.get('image'); }
  get courseId() { return this.form.get('courseId'); }

  get SelectedPositions(): number[] {
    return this.sections.map(sect => sect.position);
  }

  isUnavailable(id: number): boolean {
    // return this.SelectedPositions.includes(id);
    return false;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onFileSelected(event: any) {
    this.data.uploadImage(event, this.image);
  }

  removeSectionImage() {
    this.data.removeImage(this.image);
  }

  initSection() {
    this.initForm(this.sectionData);
  }

  onCreateSection(): void {
    if (this.sectionData == null) {
      this.addSection(this.form.value);
    } else {
      this.updateSection(this.form.value);
    }
  }

  addSection(section: Section) {
    this.sectionService.AddSection(section)
      .pipe(catchError(err => {
        return throwError(() => err.message);
      }))
      .subscribe(data => {
        this.sections.push(data)
        this.messageService.openSnackBarSuccess('Section ajoutée!', 'OK');
        this.dialogRef.close();
      })
  }

  updateSection(section: Section) {
    this.sectionService.updateSection(section)
      .pipe(catchError(err => {
        return throwError(() => err.message);
      }))
      .subscribe(data => {
        const id = this.sections.findIndex(sect => sect.id == section.id)
        if (id !== -1) {
          this.sections[id] = data;
        }
        this.messageService.openSnackBarSuccess('Section modifiée!', 'OK');
        this.dialogRef.close();
      })
  }

  ngOnInit(): void {
    this.uploading = this.data.uploading
    this.sectionData = this.data.section
    this.sections = this.data.sections
    this.courseID = this.data.courseId
    this.prevPos = this.sectionData?.position;

    this.initSection();
  }

}
