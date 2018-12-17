import { Component, OnInit } from '@angular/core';
import { PictureGalleryDataSource } from '@pages/shared/picture-gallery/picture-gallery-data-source.service';
import { DocumentModel } from '@core/api';

@Component({
  selector: 'tbwa-home-gallery',
  styleUrls: ['./home-gallery.component.scss'],
  templateUrl: './home-gallery.component.html',
})
export class HomeGalleryComponent implements OnInit {

  constructor(private pictureGalleryDataSource: PictureGalleryDataSource) { }

  layout = 'awards';
  agencyDocuments: DocumentModel[];

  ngOnInit() {
  }
}
