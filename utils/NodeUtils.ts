import { FieldNode, FieldData } from '../constants/DataTypes';

/**
 * Creates a new UUID for any object
 * @returns New UUID for anything
 */
export function createId() {
  return crypto.randomUUID();
}

export function isSectionNode(node: FieldNode<FieldData>) {
  return node.field.data.type === 'section';
}
