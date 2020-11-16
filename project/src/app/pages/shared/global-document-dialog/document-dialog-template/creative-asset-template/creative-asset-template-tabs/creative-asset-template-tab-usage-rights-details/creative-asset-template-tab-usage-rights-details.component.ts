import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DocumentModel, SearchResponse, AdvanceSearchService } from '@core/api';
import { Subject, timer, Observable, of as observableOf, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { GlobalSearchFormSettings } from '@pages/shared/global-search-form/global-search-form.interface';
import { NUXEO_DOC_TYPE } from '@environment/environment';

enum AssetTypes {
  music = 'App-Library-UsageRights-Music',
  stock = 'App-Library-UsageRights-Stock',
  photo = 'App-Library-UsageRights-Photographer',
  talent = 'App-Library-UsageRights-Talent',
}

@Component({
  selector: 'creative-asset-template-tab-usage-rights-details',
  styleUrls: ['./creative-asset-template-tab-usage-rights-details.component.scss'],
  templateUrl: './creative-asset-template-tab-usage-rights-details.component.html',
})
export class CreativeAssetTemplateTabUsageRightsDetailsComponent {

  loading: boolean = true;

  doc: DocumentModel;

  listViewSettings: any = {};

  baseParams$: Subject<any> = new Subject<any>();

  usageRights: any = {};

  private subscription: Subscription = new Subscription();

  searchFormSettings: GlobalSearchFormSettings = new GlobalSearchFormSettings({
    source: 'creative-asset-template-tab-usage-rights-details',
    enableSearchInput: false,
  });

  private usage_rights: DocumentModel[] = [];
  music: DocumentModel[] = [];
  stock: DocumentModel[] = [];
  photo: DocumentModel[] = [];
  talent: DocumentModel[] = [];

  @Input()
  set document(doc: DocumentModel) {
    if (doc) {
      this.doc = doc;
      console.log(doc);
      this.loading = false;
      timer(0).subscribe(() => { this.baseParams$.next(this.buildAssetParams(doc, doc.getParent('brand'))); });
    }
  }

  @Output() onResponsed: EventEmitter<SearchResponse> = new EventEmitter<SearchResponse>();

  constructor(
    private advanceSearchService: AdvanceSearchService,
  ) { }


  onResponse(res: SearchResponse): void {
    this.onResponsed.emit(res);
    this.usage_rights = res.response.entries;
    this.buildUR();
  }

  protected buildAssetParams(doc: DocumentModel, brand: DocumentModel): any {
    const params: any = {
      ecm_primaryType: NUXEO_DOC_TYPE.CREATIVE_UR_CONTRACT_TYPES,
      currentPageIndex: 0,
      ecm_fulltext: '',
    };
    if (doc) {
      params['ecm_uuid_not_eq'] = doc.uid;
      params['the_loupe_main_jobtitle_any'] = `["${doc.get('The_Loupe_Main:jobtitle')}"]`;
    }
    if (brand) {
      params['ecm_path'] = brand.path;
    }
    return params;
  }

  private clearUR(): void {
    this.music = [];
    this.stock = [];
    this.photo = [];
    this.talent = [];
  }

  private buildUR(): void {
    this.clearUR();
    this.usage_rights.forEach(doc => {
      switch (doc.type) {
        case AssetTypes.stock:
          this.stock.push(doc);
          break;
        case AssetTypes.talent:
          this.talent.push(doc);
          break;
        case AssetTypes.music:
          this.music.push(doc);
          break;
        case AssetTypes.photo:
          this.photo.push(doc);
          break;
        default:
          break;
      }
    });
  }

  hasUR(): boolean {
    return this.usage_rights.length > 0;
  }

  noContract(type: string): string {
    let flag: string = '';
    switch (type) {
      case AssetTypes.stock:
        flag = this.stock.length === 0 ? 'YES' : 'NO';
        break;
      case AssetTypes.talent:
        flag = this.talent.length === 0 ? 'YES' : 'NO';
        break;
      case AssetTypes.music:
        flag = this.music.length === 0 ? 'YES' : 'NO';
        break;
      case AssetTypes.photo:
        flag = this.photo.length === 0 ? 'YES' : 'NO';
        break;
      default:
        break;
    }
    return flag;
  }

}
