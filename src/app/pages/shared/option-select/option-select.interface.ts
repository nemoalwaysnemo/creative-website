
export class OptionModel {
  inputLabel?: string;
  label: string;
  value: string;
  hint?: string;
  deep?: string;
  disabled?: boolean = false;

  constructor(data: any = {}) {
    Object.assign(this, data);
    this.inputLabel = this.label;
  }
}

export class OptionSettings {
  [key: string]: any;
  placeholder: string = 'Please select value';
  closeOnSelect: boolean = false;
  iteration: boolean = false;
  bufferSize: number = 50;
  options: OptionModel[] = [];

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}


export class ItemNode {
  constructor(
    public value: string,
    public label: string,
    public inputLabel?: string,
  ) { }

  private _parent: ItemNode;
  private _children: ItemNode[] = [];
  public disabled: boolean = true;

  private setChild(child: ItemNode): void {
    this._children.push(child);
  }

  set parent(parent: ItemNode) {
    this._parent = parent;
    parent.setChild(this);
  }

  get parent(): ItemNode {
    return this._parent;
  }

  get children(): ItemNode[] {
    return this._children;
  }

  hasChildren(): boolean {
    return this._children.length > 0;
  }

  isRoot(): boolean {
    return !this._parent;
  }
}

export class ItemTree {
  constructor(public cut: string) { }
  private nodes: ItemNode[] = [];
  private parentNode: ItemNode;
  private node: ItemNode;
  private _models: OptionModel[] = [];
  private deep: number = 0;

  get models(): OptionModel[] {
    return this._models;
  }

  plantingTree(): void {
    if (this.allRoots().length === 1) {
      this.suggestionsIterator(this.root());
    } else {
      this.allRoots().forEach(node => {
        this.suggestionsIterator(node);
      });
    }
  }

  private suggestionsIterator(node: ItemNode): void {
    const model = new OptionModel({ label: node.label, value: node.value, disabled: node.disabled, deep: `deep_${this.deep}` });
    model.inputLabel = node.inputLabel;
    this.models.push(model);
    if (node.hasChildren()) {
      this.deep++;
      node.children.forEach(child => {
        this.suggestionsIterator(child);
      });
      this.deep--;
    }
  }

  addNodes(nodeString: string, nodeLabels: string = nodeString): void {
    const nodeValues = nodeString.split(this.cut);
    const nodeInputLabels = nodeLabels.split(this.cut);

    nodeValues.forEach((nodeValue: string, index: number) => {
      const value = this.parentNode ? `${this.parentNode.value}${this.cut}${nodeValue}` : nodeValue;
      const label = nodeInputLabels[index];

      if (this.findNode(value)) {
        this.node = this.findNode(value);
      } else {
        this.node = new ItemNode(value, label);
        this.nodes.push(this.node);
        if (this.parentNode) {
          this.node.parent = this.parentNode;
        }
      }

      if (index === (nodeValues.length - 1)) {
        this.node.inputLabel = nodeLabels;
        this.node.disabled = false;
      }
      this.parentNode = this.node;
    });

    this.parentNode = undefined;
  }

  private root(): ItemNode {
    return this.nodes.find(node => {
      return node.isRoot();
    });
  }

  private allRoots(): ItemNode[] {
    return this.nodes.filter(node => {
      return node.isRoot();
    });
  }

  private findNode(nodeValue: string): ItemNode {
    return this.nodes.find((node: ItemNode) => {
      return node.value === nodeValue;
    });
  }

}
