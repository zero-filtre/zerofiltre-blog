import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Section } from '../course';
import { Subject } from 'rxjs';

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

  public EditorText$ = new Subject<string>();

  constructor(
    public dialogRef: MatDialogRef<CourseSectionEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
  ) { }

  initForm(section: Section) {
    this.form = this.fb.group({
      position: [section?.position, [Validators.required]],
      title: [section?.title, [Validators.required]],
      content: [section?.content, [Validators.required]],
      image: [section?.image, [Validators.required]],
    })
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
    return this.SelectedPositions.includes(id);
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
    this.data.onSave(this.form.value, this.prevPos);
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.uploading = this.data.uploading
    this.sectionData = this.data.section
    this.sections = this.data.sections
    this.prevPos = this.sectionData?.position;

    this.initSection();
  }

}
