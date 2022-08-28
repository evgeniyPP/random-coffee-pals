import type { Component } from 'solid-js';

interface Props {
  size: number;
  strokeWidth?: number;
  class?: string;
}

const CheckCircleIcon: Component<Props> = props => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      class={`w-${props.size} h-${props.size} ${props.class ?? ''}`}
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width={props.strokeWidth ?? 2}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
};

export default CheckCircleIcon;
