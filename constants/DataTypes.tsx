/**
 * This is the default structure of the data, which can be extended for the purpose of Entries or Templates
 * as necessary.
 */
export type container_data = {
    metadata: {
        templateId: string;
        name: string;
        lastModified: number;
        order: string[];
    };

    fields: Record<string, FieldNode<FieldData>>;
}

export type template = container_data & {
    metadata: container_data["metadata"] & {
        type: "template";
        usedTime: number;
    }
}

export type entry = container_data & {
    metadata: container_data["metadata"] & {
        type: "entry";
        createdAt: number;
    }
}

export type data_container_types = entry | template;

/**
 * DataContainer Abstract Type
 */

export abstract class DataContainer<T extends data_container_types> {
    protected data: T;

    public get metadata() {
        return this.data.metadata;
    }

    public set metadata(value) {
        this.data.metadata = value;
    }

    public get fields() {
        return this.data.fields;
    }

    public set fields(value) {
        this.data.fields = value;
    }

    initialiseOrder() {
        let index = 0;
        let orderedFields: typeof this.data.metadata.order = [];
        for (const key in this.data.fields) {
            const node = this.data.fields[key];

            orderedFields[index] = node.id;
            index++;
        }

        this.data.metadata.order = orderedFields;
    }

    constructor(data: T) {
        this.data = data;

        // Only derive order from field insertion order for containers that
        // don't already carry an explicit order (e.g. brand-new containers).
        // Callers that construct a container with a deliberately-computed
        // order (moveNodeUp/moveNodeDown/insertNodeAfter/removeNode/fromJSON)
        // must have that order preserved, not silently overwritten.
        if (!this.data.metadata.order || this.data.metadata.order.length === 0) {
            this.initialiseOrder();
        }
    }

    setData(newData: T) {
        this.data = newData;
    }

    getData(): T {
        return this.data;
    }

    public toJSON(): string {
        let metadata = this.data.metadata;
        // for each value in template | entry, convert to JSON string
        type jsonData = {
            metadata: typeof metadata;
            fields: Record<string, any>;
        };

        const jsonData = {
            metadata: this.data.metadata,
            fields: {}
        } as jsonData;

        for (const key in this.data.fields) {
            const node = this.data.fields[key];
            jsonData.fields[key] = {
                id: node.id,
                type: node.type,
                field: node.field.toJSON(),
            };
        }
        return JSON.stringify(jsonData);
    }

    public getOrderedNodes(tree: DataContainer<data_container_types>): FieldNode<FieldData>[] {
        return tree.getData().metadata.order.map(id => tree.getData().fields[id]).filter(Boolean);
    }

    public insertNodeAfter(
        tree: DataContainer<data_container_types> | null,
        targetId: string,
        newNode: FieldNode<FieldData>,
    ): DataContainer<data_container_types> | null {
        if (tree == null) {
            return null;
        } else {
            const newNodes = {
                ...tree.data.fields,
                [newNode.id]: newNode,
            };

            const index = tree.data.metadata.order.indexOf(targetId);

            if (index === -1) {
                if (tree.data.metadata.type == "template") {
                    return new TemplateContainer({
                        fields: newNodes,
                        metadata: {
                            ...tree.data.metadata,
                            order: [...tree.data.metadata.order, newNode.id],
                        },
                    });
                } else if (tree.data.metadata.type == "entry") {
                    return new EntryContainer({
                        fields: newNodes,
                        metadata: {
                            ...tree.data.metadata,
                            order: [...tree.data.metadata.order, newNode.id],
                        }
                    });
                } else {
                    return null;
                }
            } else {
                const newOrder = [
                    ...tree.data.metadata.order.slice(0, index + 1),
                    newNode.id,
                    ...tree.data.metadata.order.slice(index + 1),
                ];

                if (tree.data.metadata.type == "template") {
                    return new TemplateContainer({
                        fields: newNodes,
                        metadata: {
                            ...tree.data.metadata,
                            order: newOrder,
                        },
                    });
                } else if (tree.data.metadata.type == "entry") {
                    return new EntryContainer({
                        fields: newNodes,
                        metadata: {
                            ...tree.data.metadata,
                            order: newOrder,
                        },
                    });
                } else {
                    return null;
                }
            }
        }
    }

    public removeNode(
        tree: DataContainer<data_container_types> | null,
        nodeId: string,
    ): DataContainer<data_container_types> | null {
        if (tree == null) {
            return null;
        } else {
            const { [nodeId]: _, ...restNodes } = tree.data.fields;

            switch (tree.data.metadata.type) {
                case "template":
                    return new TemplateContainer({
                        fields: restNodes,
                        metadata: {
                            ...tree.data.metadata,
                            order: tree.data.metadata.order.filter(id => id !== nodeId),
                        },
                    });
                case "entry":
                    return new EntryContainer({
                        fields: restNodes,
                        metadata: {
                            ...tree.data.metadata,
                            order: tree.data.metadata.order.filter(id => id !== nodeId),
                        },
                    });
                default:
                    return null;
            }
        }
    }

    public moveNodeUp(
        tree: DataContainer<data_container_types> | null,
        nodeId: string,
    ): DataContainer<data_container_types> | null {
        if (tree == null) {
            return null;
        } else {
            const index = tree.data.metadata.order.indexOf(nodeId);
            if (index <= 0) return tree;

            const newOrder = [...tree.data.metadata.order];

            [newOrder[index - 1], newOrder[index]] = [
                newOrder[index],
                newOrder[index - 1],
            ];
            switch (tree.data.metadata.type) {
                case "template":
                    return new TemplateContainer({
                        fields: tree.data.fields,
                        metadata: {
                            ...tree.data.metadata,
                            order: newOrder,
                        },
                    });
                case "entry":
                    return new EntryContainer({
                        fields: tree.data.fields,
                        metadata: {
                            ...tree.data.metadata,
                            order: newOrder,
                        },
                    });
            }
        }
    }

    public moveNodeDown(
        tree: DataContainer<data_container_types> | null,
        nodeId: string,
    ): DataContainer<data_container_types> | null {
        if (tree == null) {
            return null;
        } else {
            const index = tree.data.metadata.order.indexOf(nodeId);
            if (index === -1 || index >= tree.data.metadata.order.length - 1) return tree;

            const newOrder = [...tree.data.metadata.order];
            [newOrder[index], newOrder[index + 1]] = [
                newOrder[index + 1],
                newOrder[index],
            ];

            switch (tree.data.metadata.type) {
                case "template":
                    return new TemplateContainer({
                        fields: tree.data.fields,
                        metadata: {
                            ...tree.data.metadata,
                            order: newOrder,
                        },
                    });
                case "entry":
                    return new EntryContainer({
                        fields: tree.data.fields,
                        metadata: {
                            ...tree.data.metadata,
                            order: newOrder,
                        },
                    });
            }
        }
    }

    public updateFieldByPath(
        fields: Record<string, FieldNode<FieldData>>,
        newValue: FieldNode<FieldData>,
    ): boolean {
        for (const key in fields) {
            const node = fields[key];

            // Found the node
            if (node.id === newValue.id) {
                fields[key] = newValue;
                return true;
            }

            // Search children
            if (node.field.data.type === 'section') {
                const found = this.updateFieldByPath(node.field.data.childNodes, newValue);

                if (found) {
                    return true;
                }
            }
        }

        return false;
    }

    public onHandleChange(
        template: DataContainer<data_container_types>,
        defaultShown: boolean,
        value: FieldNode<FieldData>,
    ): DataContainer<data_container_types> | null {
        if (!template) return template;

        const nextData = {
            ...template.getData(),
            fields: { ...template.getData().fields },
            metadata: {
                ...template.getData().metadata,
            },
        };

        const updated = this.updateFieldByPath(nextData.fields, value);

        if (!updated) {
            return template;
        }

        if (template.getData().metadata.type === "template") {
            return new TemplateContainer(nextData as template);
        }

        return new EntryContainer(nextData as entry);
    }
}

export class EntryContainer extends DataContainer<entry> {
    constructor(data: entry) {
        super(data);
    }
}

export class TemplateContainer extends DataContainer<template> {
    constructor(data: template) {
        super(data);
    }
}

export class DataContainerFactory {
    public static fromJSON(data: string): DataContainer<data_container_types> | null {
        let parsedType: string | undefined;

        try {
            const parsedData = JSON.parse(data);
            parsedType = parsedData.metadata?.type;

            if (!parsedData.metadata || !parsedData.fields) {
                return null;
            }

            //parse fields first
            for (const key in parsedData.fields) {
                const node = parsedData.fields[key];
                if (!node.id || !node.type || !node.field) {
                    return null;
                }

                //parse field data
                const fieldData = JSON.parse(node.field);
                if (!fieldData.type || !fieldData.label || fieldData.visible === undefined) {
                    return null;
                }

                function fromJSONField(id: string, type: 'field', fieldData: any): FieldNode<FieldData> {
                    let fieldNew: FieldNode<FieldData> = {
                        id,
                        type,
                        field: null as any, // will be set below
                    };
                    switch (fieldData.type) {
                        case "text":
                            fieldNew.field = new TextField(fieldData);
                            break;
                        case "number":
                            fieldNew.field = new NumberField(fieldData);
                            break;
                        case "time":
                            fieldNew.field = new TimeField(fieldData);
                            break;
                        case "date":
                            fieldNew.field = new DateField(fieldData);
                            break;
                        case "duration":
                            fieldNew.field = new DurationField(fieldData);
                            break;
                        case "selection":
                            fieldNew.field = new SelectionField(fieldData);
                            break;
                        case "scale":
                            fieldNew.field = new ScaleField(fieldData);
                            break;
                        case "boolean":
                            fieldNew.field = new ToggleButtonField(fieldData);
                            break;
                        case "image-boolean":
                            fieldNew.field = new ToggleImageButtonField(fieldData);
                            break;
                        case "section":
                            fieldNew.field = new SectionField({
                                ...fieldData,
                                childNodes: Object.fromEntries(
                                    Object.entries(fieldData.childNodes).map(([childKey, childNode]) => {
                                        const child = childNode as { id: string; type: 'field'; field: string };
                                        return [
                                            childKey,
                                            fromJSONField(child.id, child.type, JSON.parse(child.field)),
                                        ];
                                    })
                                ),
                            });
                            break;
                    }

                    return fieldNew;
                }

                switch (fieldData.type) {
                    case "text":
                    case "number":
                    case "time":
                    case "date":
                    case "duration":
                    case "selection":
                    case "scale":
                    case "boolean":
                    case "image-boolean":
                    case "section":
                        parsedData.fields[key] = fromJSONField(node.id, node.type, fieldData);
                        break;
                }
            }

            // assume metadata and fields are present.
            //metadata.type to determine which datacontainer type
            if (parsedData.metadata.type === "template") {
                return new TemplateContainer(parsedData as template);
            } else if (parsedData.metadata.type === "entry") {
                return new EntryContainer(parsedData as entry);
            }
        } catch (error) {
            console.error("Error parsing JSON:", error);
            return null;
        }

        throw new Error(`DataContainerFactory.fromJSON: unrecognized metadata.type "${parsedType}"`);
    }
}

/**
 * Field Types
 */

export type BaseData = {
    type: string;
    label: string;
    visible: boolean;
}

export type TextData = BaseData & {
    type: 'text',
    value: string,
};

export type NumberData = BaseData & {
    type: 'number';
    value: number;
};

export type TimeData = BaseData & {
    type: 'time';
    value: string;
    format?: string; // REGEX? from settings, just to validate
};

export type DateData = BaseData & {
    type: 'date';
    value: string;
    format?: string; // REGEX? from settings, just to validate
};

export type DurationData = BaseData & {
    type: 'duration';
    valueA: number; // allowed to be 0, must be an unsigned int
    valueB: number; // allowed to be 0, must be an unsigned int
    unitA: string;
    unitB: string;
};

export type SelectionData = BaseData & {
    type: 'selection';
    multiple: boolean;
    selected: string[]; // the actual value
    options: any[]; // the choices
};

export type ScaleData = BaseData & {
    type: 'scale';
    value: number;
    imageBased: boolean; // create more varied range for 1-10 instead of just 1-5
    min: number; // unsigned int, allowed to be 0
    max: number; // unsigned int, allowed to be 0
    label: string;
    images: string[]; // per-position icon overrides; index i falls back to settings **image(i+1) when unset
};

export type ToggleButtonData = BaseData & {
    type: 'boolean';
    value: boolean;
    label: string;
    labelSelected: string;
    labelUnselected: string;
};

export type ToggleImageButtonData = BaseData & {
    type: 'image-boolean';
    value: boolean;
    imageSelected: string; // falls back to settings **image5 when unset - see BooleanImageInputField.tsx
    imageUnselected: string; // falls back to settings **image1 when unset
};

export type SettingsData = TextData;

export type SectionData = BaseData & {
    id: string;
    type: 'section';
    orientation: 'column' | 'row';
    childNodes: Record<string, FieldNode<FieldData>>;
};

export type FieldData =
    | TextData
    | DateData
    | DurationData
    | SelectionData
    | ScaleData
    | ToggleButtonData
    | ToggleImageButtonData
    | TimeData
    | NumberData
    | SettingsData
    | SectionData;

export abstract class field_data<T extends FieldData> {
    constructor(
        public data: T
    ) { }

    public moveUp(): void { }
    public moveDown(): void { }
    public deleteNode(): void { }

    public clone(): this {
        return Object.assign(
            Object.create(Object.getPrototypeOf(this)),
            this,
            { data: { ...this.data } },
        ) as this;
    }

    abstract setData(newData: any): void;
    abstract getData(): any;

    abstract toJSON(): string;
}

export type FieldNode<T extends FieldData> = {
    id: string;
    type: 'field';
    field: field_data<T>;
};

export type field_node<T extends FieldData> = FieldNode<T>;

export class TextField extends field_data<TextData> {
    constructor(data: TextData) {
        super({
            type: "text",
            label: data.label,
            visible: data.visible,
            value: data.value,
        });
    }

    setData(newData: any) {
        this.data.value = newData;
    }

    getData() {
        return this.data.value;
    }

    toJSON(): string {
        return JSON.stringify({
            type: this.data.type,
            label: this.data.label,
            visible: this.data.visible,
            value: this.data.value,
        });
    }
}

export class NumberField extends field_data<NumberData> {
    constructor(data: NumberData) {
        super({
            type: "number",
            label: data.label,
            visible: data.visible,
            value: data.value,
        });
    }

    setData(newData: any) {
        this.data.value = newData;
    }

    getData() {
        return this.data.value;
    }

    toJSON(): string {
        return JSON.stringify({
            type: this.data.type,
            label: this.data.label,
            visible: this.data.visible,
            value: this.data.value,
        });
    }
}

export class TimeField extends field_data<TimeData> {
    constructor(data: TimeData) {
        super({
            type: "time",
            label: data.label,
            visible: data.visible,
            value: data.value,
            format: data.format,
        });
    }

    setData(newData: any) {
        this.data.value = newData;
    }

    getData() {
        return this.data.value;
    }

    toJSON(): string {
        return JSON.stringify({
            type: this.data.type,
            label: this.data.label,
            visible: this.data.visible,
            value: this.data.value,
            format: this.data.format,
        });
    }
}

export class DateField extends field_data<DateData> {
    constructor(data: DateData) {
        super({
            type: "date",
            label: data.label,
            visible: data.visible,
            value: data.value,
            format: data.format,
        });
    }

    setData(newData: any) {
        this.data.value = newData;
    }

    getData() {
        return this.data.value;
    }

    toJSON(): string {
        return JSON.stringify({
            type: this.data.type,
            label: this.data.label,
            visible: this.data.visible,
            value: this.data.value,
            format: this.data.format,
        });
    }
}

export class DurationField extends field_data<DurationData> {
    constructor(data: DurationData) {
        super({
            type: "duration",
            label: data.label,
            visible: data.visible,
            valueA: data.valueA,
            valueB: data.valueB,
            unitA: data.unitA,
            unitB: data.unitB,
        });
    }

    setData(newData: any) {
        this.data.valueA = newData;
    }

    setDataB(newData: any) {
        this.data.valueB = newData;
    }

    getData() {
        return {
            valueA: this.data.valueA,
            valueB: this.data.valueB,
            unitA: this.data.unitA,
            unitB: this.data.unitB,
        };
    }

    getDataA() {
        return {
            valueA: this.data.valueA,
            unitA: this.data.unitA,
        };
    }

    getDataB() {
        return {
            valueB: this.data.valueB,
            unitB: this.data.unitB,
        };
    }

    toJSON(): string {
        return JSON.stringify({
            type: this.data.type,
            label: this.data.label,
            visible: this.data.visible,
            valueA: this.data.valueA,
            valueB: this.data.valueB,
            unitA: this.data.unitA,
            unitB: this.data.unitB,
        });
    }
}

export class ScaleField extends field_data<ScaleData> {
    constructor(data: ScaleData) {
        super({
            type: "scale",
            label: data.label,
            visible: data.visible,
            imageBased: data.imageBased,
            min: data.min,
            max: data.max,
            value: data.value,
            images: data.images ?? [],
        });
    }

    setData(newData: any) {
        this.data.value = newData;
    }

    getData() {
        return this.data.value;
    }

    setImage(index: number, uri: string) {
        const images = [...this.data.images];
        images[index] = uri;
        this.data.images = images;
    }

    toJSON(): string {
        return JSON.stringify({
            type: this.data.type,
            label: this.data.label,
            visible: this.data.visible,
            value: this.data.value,
            imageBased: this.data.imageBased,
            min: this.data.min,
            max: this.data.max,
            images: this.data.images,
        });
    }
}

export class ToggleButtonField extends field_data<ToggleButtonData> {
    constructor(data: ToggleButtonData) {
        super({
            type: "boolean",
            label: data.label,
            visible: data.visible,
            labelSelected: data.labelSelected,
            labelUnselected: data.labelUnselected,
            value: data.value,
        });
    }

    setData(newData: any) {
        this.data.value = newData;
    }

    getData() {
        return this.data.value;
    }

    toJSON(): string {
        return JSON.stringify({
            type: this.data.type,
            label: this.data.label,
            visible: this.data.visible,
            value: this.data.value,
        });
    }
}

export class ToggleImageButtonField extends field_data<ToggleImageButtonData> {
    constructor(data: ToggleImageButtonData) {
        super({
            type: "image-boolean",
            label: data.label,
            visible: data.visible,
            imageSelected: data.imageSelected,
            imageUnselected: data.imageUnselected,
            value: data.value,
        });
    }

    setData(newData: any) {
        this.data.value = newData;
    }

    getData() {
        return this.data.value;
    }

    setImageSelected(uri: string) {
        this.data.imageSelected = uri;
    }

    setImageUnselected(uri: string) {
        this.data.imageUnselected = uri;
    }

    toJSON(): string {
        return JSON.stringify({
            type: this.data.type,
            label: this.data.label,
            visible: this.data.visible,
            imageSelected: this.data.imageSelected,
            imageUnselected: this.data.imageUnselected,
            value: this.data.value,
        });
    }
}

export class SectionField extends field_data<SectionData> {
    constructor(data: SectionData) {
        super({
            type: "section",
            label: data.label,
            visible: data.visible,
            id: data.id,
            orientation: data.orientation,
            childNodes: data.childNodes,
        });
    }

    setData(newData: any) {
        this.data.childNodes = newData;
    }

    getData() {
        return this.data.childNodes;
    }

    setOrientation(orientation: 'row' | 'column') {
        this.data.orientation = orientation;
    }

    /**
     * Inserts newNode into childNodes after the child keyed by targetId,
     * or at the end if targetId is '' or not found. Mirrors
     * DataContainer.insertNodeAfter, but childNodes has no separate order
     * array - key insertion order into the rebuilt object is the order.
     */
    insertChildAfter(targetId: string, newNode: FieldNode<FieldData>): SectionField {
        const clone = this.clone() as SectionField;
        const entries = Object.entries(clone.data.childNodes);
        const index = entries.findIndex(([key]) => key === targetId);

        entries.splice(index === -1 ? entries.length : index + 1, 0, [newNode.id, newNode]);

        clone.data.childNodes = Object.fromEntries(entries);
        return clone;
    }

    removeChild(targetId: string): SectionField {
        const clone = this.clone() as SectionField;
        const { [targetId]: _, ...rest } = clone.data.childNodes;
        clone.data.childNodes = rest;
        return clone;
    }

    moveChildUp(targetId: string): SectionField {
        const clone = this.clone() as SectionField;
        const entries = Object.entries(clone.data.childNodes);
        const index = entries.findIndex(([key]) => key === targetId);
        if (index <= 0) return clone;

        [entries[index - 1], entries[index]] = [entries[index], entries[index - 1]];
        clone.data.childNodes = Object.fromEntries(entries);
        return clone;
    }

    moveChildDown(targetId: string): SectionField {
        const clone = this.clone() as SectionField;
        const entries = Object.entries(clone.data.childNodes);
        const index = entries.findIndex(([key]) => key === targetId);
        if (index === -1 || index >= entries.length - 1) return clone;

        [entries[index], entries[index + 1]] = [entries[index + 1], entries[index]];
        clone.data.childNodes = Object.fromEntries(entries);
        return clone;
    }

    toJSON(): string {
        let jsonData = {
            type: this.data.type,
            label: this.data.label,
            visible: this.data.visible,
            id: this.data.id,
            orientation: this.data.orientation,
            childNodes: {} as Record<string, any>,
        }

        jsonData.childNodes = Object.fromEntries(
            Object.entries(this.data.childNodes).map(([key, node]) => [
                key,
                {
                    id: node.id,
                    type: node.type,
                    field: node.field.toJSON(),
                },
            ])
        );

        return JSON.stringify(jsonData);
    }
}

export class SelectionField extends field_data<SelectionData> {
    constructor(data: SelectionData) {
        super({
            type: "selection",
            label: data.label,
            visible: data.visible,
            multiple: data.multiple,
            selected: data.selected,
            options: data.options
        });
    }

    setData(newData: any) {
        this.data.selected = newData;
    }

    getData() {
        return this.data.selected;
    }

    addOption(option: { id: string; name: string }): SelectionField {
        const clone = this.clone() as SelectionField;
        clone.data.options = [...clone.data.options, option];
        return clone;
    }

    removeOption(optionId: string): SelectionField {
        const clone = this.clone() as SelectionField;
        clone.data.options = clone.data.options.filter(option => option?.id !== optionId);
        clone.data.selected = clone.data.selected.filter(id => id !== optionId);
        return clone;
    }

    toJSON(): string {
        return JSON.stringify({
            type: this.data.type,
            label: this.data.label,
            visible: this.data.visible,
            multiple: this.data.multiple,
            selected: this.data.selected,
            options: this.data.options
        });
    }
}

/**
 * Base Props
 */

export type BaseFieldProps = {
    id: string;
    template: DataContainer<data_container_types>;
    fieldKey: string;
    defaultShown: boolean;
    locked: boolean;
    edit?: boolean;

    onChange?: (
        template: DataContainer<data_container_types>,
        defaultShown: boolean,
        newValue: FieldNode<FieldData>,
    ) => void;
};

/**
 * Generic Typed Props
 */

export type StandardFieldProps<T extends FieldData = FieldData> =
    BaseFieldProps & {
        field: FieldNode<T>;
    };