import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { DocumentModel } from '@core/api';
import { takeWhile, filter } from 'rxjs/operators';
import { DocumentRelatedInfoService, DocumentsBag } from '../document-related-info.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'tbwa-document-related-info-view',
  styleUrls: ['./document-related-info-view.component.scss'],
  templateUrl: './document-related-info-view.component.html',
})
export class DocumentRelatedInfoViewComponent implements OnInit, OnDestroy {

  @Input() title: string;
  @Input() layout: string;
  @Input() itemLayout: string;
  @Input() documents: DocumentModel[];
  @Input() params: {};

  private alive = true;
  loading = true;
  queryField: FormControl = new FormControl();

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

  onKeyup(event: KeyboardEvent) {
    if (this.alive) {
      this.documentRelatedInfoService.search(this.queryField.value, { name: this.title, params: this.params });
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }
}
