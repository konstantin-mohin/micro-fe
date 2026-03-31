import React from 'react';
import Expandable from '../../components/Expandable';

interface ComponentNode {
  component: string;
  props: { [key: string]: any; children?: TreeNode };
  key?: string;
}

type TreeNode = string | ComponentNode | (string | ComponentNode)[];

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

  return (
    <Component key={key} {...props}>
      {props.children && <ComponentTreeRenderer node={props.children} />}
    </Component>
  );
}
