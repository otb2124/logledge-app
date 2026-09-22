import { Component, computed, Input, Output, EventEmitter, SimpleChanges, OnChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectControl, SelectControlOption } from '../field-controls/select-control/select-control';
import { TreeNode } from 'primeng/api';
import { ResourcePickerAction, ResourcePickerControl } from '../field-controls/resource-picker-control/resource-picker-control';
import { BooleanControl } from '../field-controls/boolean-control/boolean-control';
import { ColorPickerControl } from '../field-controls/color-picker-control/color-picker-control';
import { EditableTableControl } from '../field-controls/editable-table-control/editable-table-control';
import { ImageSelectOption, ImageSelectSize, ImageSelectControl } from '../field-controls/image-select-control/image-select-control';
import { InputNumberControl } from '../field-controls/input-number-control/input-number-control';
import { InputTextControl } from '../field-controls/input-text-control/input-text-control';
import { ListControl } from '../field-controls/list-control/list-control';
import { TreeSelectControl } from '../field-controls/tree-select-control/tree-select-control';

export type PropertyPath = string;

export interface FieldTarget {
  getField(path: PropertyPath): unknown;
  setField(path: PropertyPath, value: unknown): void;
}

/** Utility adapter to convert a standard object into a FieldTarget */
export class RecordFieldTarget implements FieldTarget {
  constructor(private record: Record<string, any>) {}
  getField(path: PropertyPath): unknown {
    return this.record[path];
  }
  setField(path: PropertyPath, value: unknown): void {
    this.record[path] = value;
  }
}

export interface FieldValidator {
  type: 'required' | 'email' | 'minLength' | 'pattern' | 'custom';
  value?: any;
  message: string;
  validate?: (value: unknown) => boolean;
}

interface FieldConfigBase {
  path: PropertyPath;
  label: string;
  defaultValue?: any;
  visibleIf?: (target: FieldTarget) => boolean;
  validators?: FieldValidator[]; // NEW
}

export type FieldConfig =
  | (FieldConfigBase & { kind: 'text'; inputType?: 'text' | 'email' | 'password'; maxlength?: number; })
  | (FieldConfigBase & { kind: 'number'; step?: number; min?: number; max?: number; minFractionDigits?: number; maxFractionDigits?: number; prefix?: string; suffix?: string; })
  | (FieldConfigBase & { kind: 'select'; options: SelectControlOption[]; })
  | (FieldConfigBase & {
    kind: 'tree-select';
    path: string;
    label: string;
    options: TreeNode[];
    selectionMode?: 'single' | 'multiple' | 'checkbox';
    placeholder?: string;
  })
  | (FieldConfigBase & { kind: 'boolean'; })
  | (FieldConfigBase & { kind: 'color'; allowAlpha?: boolean; })
  | (FieldConfigBase & { kind: 'vector'; axisLabels?: string[]; step?: number; displayScale?: number; min?: number; max?: number; minFractionDigits?: number; maxFractionDigits?: number; prefix?: string | string[]; suffix?: string | string[]; })
  | (FieldConfigBase & { kind: 'tags'; })
  | (FieldConfigBase & { kind: 'resource-picker'; actions: ResourcePickerAction[]; })
  | (FieldConfigBase & { kind: 'image-select'; options: ImageSelectOption[]; size?: ImageSelectSize; showItemLabels?: boolean; })
  | (FieldConfigBase & { kind: 'list'; path: string; label: string; itemConfig: FieldConfig })
  | (FieldConfigBase & { kind: 'editable-table'; columns: FieldConfig[]; allowAdd?: boolean; allowDelete?: boolean; allowReorder?: boolean; });

export interface PropertyPanelConfig {
  key: string;
  icon: string;
  label: string;
  fields: FieldConfig[];
}

@Component({
  selector: 'app-field-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextControl,
    InputNumberControl,
    SelectControl,
    TreeSelectControl,
    BooleanControl,
    ResourcePickerControl,
    ColorPickerControl,
    ImageSelectControl,
    EditableTableControl,
    ListControl,
  ],
  templateUrl: './field-list.html',
  styleUrl: './field-list.css',
})
export class FieldList implements OnChanges {
  @Input() target?: FieldTarget;
  @Input() model?: Record<string, any>;
  @Input() fields: FieldConfig[] = [];
  @Input() direction: 'vertical' | 'horizontal' = 'vertical';
  @Input() hideLabels = false;
  @Input() fullWidthControls = false;

  @Output() modelChange = new EventEmitter<Record<string, any>>();

  protected effectiveTarget!: FieldTarget;

  protected touchedPaths = signal<Set<string>>(new Set());

  protected getErrors(): Record<string, string> {
    const map: Record<string, string> = {};
    for (const field of this.fields) {
      const value = this.effectiveTarget?.getField(field.path);
      const message = this.validateField(field, value);
      if (message) map[field.path] = message;
    }
    return map;
  }

  valid(): boolean {
    return Object.keys(this.getErrors()).length === 0;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.target) {
      this.effectiveTarget = this.target;
    } else if (this.model) {
      this.effectiveTarget = new RecordFieldTarget(this.model);
    }
  }

  protected visibleFields = computed(() =>
    this.fields.filter(f => !f.visibleIf || (this.effectiveTarget && f.visibleIf(this.effectiveTarget)))
  );

  protected getValue<T>(path: PropertyPath): T {
    return this.effectiveTarget?.getField(path) as T;
  }

  protected onResourceAction(path: PropertyPath, event: { actionId: string; path: string | null }) {
    // Route resource action
  }


  markAllTouched(): void {
    this.touchedPaths.set(new Set(this.fields.map(f => f.path)));
  }

  protected isTouched(path: string): boolean {
    return this.touchedPaths().has(path);
  }

  protected setValue(path: PropertyPath, value: unknown): void {
    this.effectiveTarget?.setField(path, value);
    const next = new Set(this.touchedPaths());
    next.add(path);
    this.touchedPaths.set(next);
    if (this.model) {
      this.modelChange.emit(this.model);
    }
  }

  private validateField(field: FieldConfig, value: unknown): string | null {
    for (const v of field.validators ?? []) {
      switch (v.type) {
        case 'required':
          if (value === null || value === undefined || value === '') return v.message;
          break;
        case 'email':
          if (typeof value === 'string' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return v.message;
          break;
        case 'minLength':
          if (typeof value === 'string' && value.length < (v.value ?? 0)) return v.message;
          break;
        case 'pattern':
          if (typeof value === 'string' && !new RegExp(v.value).test(value)) return v.message;
          break;
        case 'custom':
          if (v.validate && !v.validate(value)) return v.message;
          break;
      }
    }
    return null;
  }
}