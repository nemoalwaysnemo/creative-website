import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { DocumentModel } from '@core/api';
import { takeWhile, filter } from 'rxjs/operators';
import { DocumentRelatedInfoService, DocumentsBag } from '../document-related-info.service';

@Component({
  selector: 'tbwa-document-related-info-view',
  styleUrls: ['./document-related-info-view.component.scss'],
  templateUrl: './document-related-info-view.component.html',
})
export class DocumentRelatedInfoViewComponent implements OnInit, OnDestroy {

  @Input() title: string;
  @Input() documents: DocumentModel[];

  private alive = true;
  loading = true;

  constructor(private documentRelatedInfoService: DocumentRelatedInfoService) { }

  ngOnInit() {
    this.documentRelatedInfoService.onChangeTab()
      .pipe(
        takeWhile(() => this.alive),
        filter(({ name }) => name === this.title),
      )
      .subscribe((res: DocumentsBag) => {
        this.loading = false;
        this.documents = res.documents;
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
