import { useNavigate } from '@solidjs/router';
import { Component, onMount, Show } from 'solid-js';
import AddMember from '../components/AddMember';
import MembersList from '../components/MembersList';
import { openModal } from '../components/Modal';
import { Break, Meet } from '../models';
import { isLoading, setIsLoading } from '../stores/loading';
import { getMeets } from '../stores/meets';
import { getMembers, members } from '../stores/members';
import { supabase } from '../utils/api';
import { createMeets } from '../utils/helpers';
import { getUniqueName } from '../utils/name-generator';

const Members: Component = () => {
  const navigate = useNavigate();

  onMount(async () => {
    await getMembers();
  });

  const handleGenerateClick = () => {
    const activeMembers = members().filter(m => m.is_active);

    if (activeMembers.length % 2 !== 0) {
      openModal({
        title: 'You have an odd number of active pals',
        content: 'This means someone will not get a pair. Are you sure you want to continue?',
        action: () => generate(),
        actionLabel: 'Continue'
      });
    }

    generate();
  };

  const generate = async () => {
    const user = supabase.auth.user();

    if (!user?.id) {
      throw new Error('Generating a break but no users');
    }

    setIsLoading(true);
    const { data: breakData, error: breakError } = await supabase
      .from<Break>('breaks')
      .insert({ user_id: user.id, name: getUniqueName() })
      .single();

    if (breakError) {
      // TODO: handle errors
      console.error(breakError);
      setIsLoading(false);
      return;
    }

    const newMeets = await createMeets(breakData.id);
    const { error: meetsError } = await supabase
      .from<Meet>('meets')
      .insert(newMeets, { returning: 'minimal' });

    if (meetsError) {
      // TODO: handle errors
      console.error(meetsError);
      setIsLoading(false);
      return;
    }

    await getMeets(breakData.id, { refetch: true });
    setIsLoading(false);
    navigate(`/breaks/${breakData.id}`);
  };

  return (
    <Show when={members()?.length}>
      <div class="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 flex flex-col">
        <h2 class="text-center text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Your Coffee Pals
        </h2>
        <MembersList />
        <AddMember />

        <button
          onClick={handleGenerateClick}
          disabled={isLoading()}
          class="mt-8 inline-flex justify-center items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-yellow-700 hover:bg-yellow-800 focus-default"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="mr-3 h-6 w-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
            />
          </svg>
          Take a coffee break
        </button>
      </div>
    </Show>
  );
};

export default Members;