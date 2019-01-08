import { Component, OnInit, Input } from '@angular/core';
import { DocumentModel, AdvanceSearch } from '@core/api';
import { Observable, of as observableOf, BehaviorSubject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { OptionModel } from '@pages/shared';
import { deepExtend } from '@core/custom/ng2-smart-table/lib/helpers';
import { selectObjectByKeys } from '@core/services';

@Component({
  selector: 'tbwa-search-result-list',
  styleUrls: ['./search-result-list.component.scss'],
  templateUrl: './search-result-list.component.html',
})
export class SearchResultListComponent implements OnInit {

  // @Input() documents;

  listSettings: any = {
    mode: 'inline', // inline|external|click-to-edit
    selectMode: 'single', // single|multi
    hideHeader: false,
    hideSubHeader: true,
    actions: {
      columnTitle: 'Actions',
      add: true,
      edit: true,
      delete: true,
      custom: [],
      position: 'left', // left|right
    },
    filter: {
      inputClass: '',
    },
    add: {
      inputClass: '',
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: false,
    },
    edit: {
      inputClass: '',
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: false,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    attr: {
      id: '',
      class: '',
    },
    noDataMessage: 'No data found',
    pager: {
      display: true,
      perPage: 20,
    },
    rowClassFunction: () => '',
    columns: {
      img: {
        title: 'Preview',
        type: 'html',
      },
      title: {
        title: 'Title',
        type: 'html',
        sort: false,
      },
      date: {
        title: 'Year',
        sort: false,
      },
      description: {
        title: 'Description',
        type: 'html',
        sort: false,
      },
      agency: {
        title: 'Agency',
        sort: false,
      },
    },
  };
  data  = [];

  ngOnInit() {
  }

}
