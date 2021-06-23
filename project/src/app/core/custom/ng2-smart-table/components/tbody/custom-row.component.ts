import { ChangeDetectionStrategy, Component, Input, TemplateRef } from '@angular/core';
import { Row } from '../../lib/data-set/row';
import { Grid } from '../../lib/grid';

@Component({
  selector: 'ng2-st-tbody-custom-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [ngClass]="['html-template', getLayout()]">
      <ng-template #rowTemplate [ngTemplateOutlet]="templateRef" [ngTemplateOutletContext]="{row: row}"></ng-template>
    </div>
 `,
})
export class TbodyCustomRowComponent {

  @Input() grid: Grid;

  @Input() row: Row;

  @Input() templateRef: TemplateRef<any>;

  getLayout(): string {
    return this.grid.settings.extendRow.layout || '';
  }

}
