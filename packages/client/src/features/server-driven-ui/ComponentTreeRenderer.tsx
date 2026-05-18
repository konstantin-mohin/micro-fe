import React from 'react';
import Expandable from '../../components/Expandable';

interface ComponentNode {
  component: string;
  props: { [key: string]: unknown; children?: TreeNode };
  key?: string;
}

export type TreeNode = string | ComponentNode | (string | ComponentNode)[];

const componentMap: { [key: string]: React.ElementType } = {
  Expandable,
  p: 'p',
};

export function ComponentTreeRenderer({ node }: { node: TreeNode }): React.ReactElement | null {
  if (typeof node === 'string') {
    return <>{node}</>;
  }

  if (!node) {
    return null;
  }

  if (Array.isArray(node)) {
    return (
      <>
        {node.map((n, i) => (
          <ComponentTreeRenderer key={i} node={n} />
        ))}
      </>
    );
  }

  const { component, props, key } = node;
  const Component = componentMap[component];

  if (!Component) {
    return null;
  }
  const { children, ...restProps } = props;

  return (
    <Component key={key} {...restProps}>
      {children !== undefined && <ComponentTreeRenderer node={children} />}
    </Component>
  );
}
