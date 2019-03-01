import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DocumentModel, NuxeoPagination, AdvanceSearch } from '@core/api';
import { takeWhile, tap, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { NUXEO_META_INFO } from '@environment/environment';
import { isDocumentUID } from '@core/services';

@Component({
  selector: 'tbwa-asset-view',
  styleUrls: ['./asset-view.component.scss'],
  templateUrl: './asset-view.component.html',
})
export class AssetViewComponent {

  @Input() document: DocumentModel;
}
