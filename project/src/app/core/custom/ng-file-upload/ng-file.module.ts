import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgFileUploadStatusDirective } from './ng-file-upload-status.directive';
import { NgFileBackgroundDirective } from './ng-file-background.directive';
import { NgFileFormDataDirective } from './ng-file-form-data.directive';
import { NgFileDropDirective } from './ng-file-drop.directive';
import { NgFileDirective } from './ng-file.directive';

const Declarations = [
  NgFileDropDirective,
  NgFileBackgroundDirective,
  NgFileUploadStatusDirective,
  NgFileFormDataDirective,
  NgFileDirective,
];

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: Declarations,
  exports: Declarations,
}) export class NgFileModule {}
