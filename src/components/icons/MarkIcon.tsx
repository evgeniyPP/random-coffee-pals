import type { Component } from 'solid-js';

interface Props {
  size: number;
  strokeWidth?: number;
  class?: string;
}

const MarkIcon: Component<Props> = props => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width={props.strokeWidth ?? 2}
      stroke="currentColor"
      class={`w-${props.size} h-${props.size} ${props.class || ''}`}
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
};

export default MarkIcon;
