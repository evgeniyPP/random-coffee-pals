import type { Component } from 'solid-js';

interface Props {
  size: number;
  strokeWidth?: number;
  class?: string;
}

const CheckIcon: Component<Props> = props => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width={props.strokeWidth ?? 2}
      stroke="currentColor"
      class={`w-${props.size} h-${props.size} ${props.class || ''}`}
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.5l6.75 6.75L21 4.5" />
    </svg>
  );
};

export default CheckIcon;
