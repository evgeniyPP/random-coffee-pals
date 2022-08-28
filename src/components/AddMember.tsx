import { Component, createSignal } from 'solid-js';
import { Member } from '../models';
import { isLoading, setIsLoading } from '../stores/loading';
import { getMembers } from '../stores/members';
import { supabase } from '../utils/api';
import { t } from '../utils/text';
import { openModal } from './Modal';
import { showErrorNotification } from './Notification';

const AddMember: Component = () => {
  const [name, setName] = createSignal('');
  const [contact, setContact] = createSignal('');

  const openAddModal = () => {
    if (!name().length) {
      return;
    }

    openModal({
      title: `Add a new ${t('coffee pal')}?`,
      content: `Are you sure you want to add ${name()} as your ${t('coffee pal')}?`,
      action: () => handleAdd(),
      actionLabel: 'Add'
    });
  };

  const handleAdd = async () => {
    if (!name()) {
      return;
    }

    const user = supabase.auth.user();

    if (!user) {
      throw new Error('Adding a new member but no user');
    }

    setIsLoading(true);
    const { error } = await supabase.from<Member>('members').insert(
      {
        user_id: user.id,
        name: name(),
        contact: contact() || null,
        is_active: true
      },
      { returning: 'minimal' }
    );

    if (error) {
      console.error(error);
      setIsLoading(false);
      showErrorNotification();
      return;
    }

    await getMembers({ refetch: true });
    setName('');
    setContact('');
    setIsLoading(false);
  };

  return (
    <div class="mt-8 flex items-center space-x-4">
      <div class="flex-1">
        <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Add a new {t('coffee pal')}
        </label>
        <div class="mt-1 flex -space-x-px">
          <input
            onInput={e => setName(e.currentTarget.value)}
            value={name()}
            disabled={isLoading()}
            type="text"
            name="name"
            id="name"
            class="shadow-sm block w-full sm:text-sm border-gray-300 rounded-l-md focus-default dark:bg-gray-900"
            placeholder={`${t('Pal')}'s name`}
          />
          <input
            onInput={e => setContact(e.currentTarget.value)}
            value={contact()}
            disabled={isLoading()}
            type="text"
            name="name"
            id="name"
            class="shadow-sm block w-full sm:text-sm border-gray-300 rounded-r-md focus-default dark:bg-gray-900"
            placeholder={`${t('Pal')}'s contact (optional)`}
          />
        </div>
      </div>
      <button
        onClick={openAddModal}
        disabled={isLoading() || !name().length}
        class="mt-6 shadow-sm px-4 py-1.5 border border-gray-300 leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus-default dark:bg-gray-900 dark:hover:bg-gray-700 dark:text-gray-200"
      >
        Add
      </button>
    </div>
  );
};

export default AddMember;
