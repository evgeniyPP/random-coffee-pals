import { Component, onMount, Show } from 'solid-js';
import AddMember from '../components/AddMember';
import MembersList from '../components/MembersList';
import { getMembers, members } from '../stores/members';

const Teammates: Component = () => {
  onMount(async () => {
    await getMembers();
  });

  return (
    <Show when={members()?.length}>
      <div class="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <h2 class="text-center text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Your Teammates
        </h2>
        <MembersList />
        <AddMember />
      </div>
    </Show>
  );
};

export default Teammates;
