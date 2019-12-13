import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { DocumentModel } from '@core/api';

@Component({
  selector: 'creative-brand-form-button',
  styleUrls: ['./creative-brand-form-button.component.scss'],
  templateUrl: './creative-brand-form-button.component.html',
})
export class CreativeBrandFormButtonComponent {

  @Input() document: DocumentModel;

  @Input() type: 'image' | 'video' | 'audio' | 'model' | 'music' | 'photo' | 'stock' | 'campaign' | 'project';
}
