import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthService } from '../../../../user/auth.service';

@Component({
  selector: 'app-auto-save-button',
  templateUrl: './auto-save-button.component.html',
  styleUrls: ['./auto-save-button.component.css']
})
export class AutoSaveButtonComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() loading!: boolean;
  @Input() isPublishing!: boolean;
  @Input() isPublished!: boolean;
  @Input() isSaving!: boolean;
  @Input() isSaved!: boolean;
  @Input() saveFailed!: boolean;

  @Output() publishEvent = new EventEmitter<string>();

  constructor(
    public authService: AuthService
  ) { }

  initPublish() {
    this.publishEvent.emit()
  }

  ngOnInit(): void {
  }

}
