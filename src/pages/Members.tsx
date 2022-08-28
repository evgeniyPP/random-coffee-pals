import { useNavigate } from '@solidjs/router';
import { Component, onMount, Show } from 'solid-js';
import AddMember from '../components/AddMember';
import Squares2x2Icon from '../components/icons/Squares2x2Icon';
import MembersList from '../components/MembersList';
import { openModal } from '../components/Modal';
import { showErrorNotification } from '../components/Notification';
import { Break, Meet } from '../models';
import { isLoading, setIsLoading } from '../stores/loading';
import { getMeets } from '../stores/meets';
import { getMembers, members } from '../stores/members';
import { supabase } from '../utils/api';
import { createMeets } from '../utils/helpers';
import { getUniqueCoffeeName, getUniqueTeaName } from '../utils/name-generator';
import { t } from '../utils/text';

const Members: Component = () => {
  const navigate = useNavigate();

  onMount(async () => {
    await getMembers();
  });

  const handleGenerateClick = () => {
    const activeMembers = members()?.filter(m => m.is_active) ?? [];

    if (activeMembers.length % 2 !== 0) {
      openModal({
        title: `You have an odd number of active ${t('pal')}s`,
        content: 'This means someone will not get a pair. Are you sure you want to continue?',
        action: () => generate(),
        actionLabel: 'Continue'
      });
      return;
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
      .insert({
        user_id: user.id,
        coffee_name: getUniqueCoffeeName(),
        tea_name: getUniqueTeaName()
      })
      .single();

    if (breakError) {
      console.error(breakError);
      setIsLoading(false);
      showErrorNotification();
      return;
    }

    const newMeets = await createMeets(breakData.id);
    const { error: meetsError } = await supabase
      .from<Meet>('meets')
      .insert(newMeets, { returning: 'minimal' });

    if (meetsError) {
      console.error(meetsError);
      setIsLoading(false);
      showErrorNotification();
      return;
    }

    await getMeets(breakData.id, { refetch: true });
    setIsLoading(false);
    navigate(`/breaks/${breakData.id}`);
  };

  return (
    <Show when={members()}>
      <div class="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 flex flex-col">
        <h2 class="text-center text-3xl font-extrabold tracking-tight sm:text-4xl">
          Your {t('Coffee Pals')}
        </h2>
        <MembersList />
        <AddMember />

        <button
          onClick={handleGenerateClick}
          disabled={isLoading()}
          class="mt-8 inline-flex justify-center items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-primary-700 hover:bg-primary-800 focus-default"
        >
          <Squares2x2Icon size={6} strokeWidth={1.5} class="mr-3" />
          Take a {t('coffee')} break
        </button>
      </div>
    </Show>
  );
};

export default Members;
