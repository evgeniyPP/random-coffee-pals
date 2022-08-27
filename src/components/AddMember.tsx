import { Component, createSignal } from 'solid-js';
import { z } from 'zod';
import { getMembers } from '../stores/members';
import { supabase } from '../utils/api';
import { openModal } from './Modal';

const AddMember: Component = () => {
  const [name, setName] = createSignal('');

  const openAddModal = () => {
    if (!name().length) {
      return;
    }

    openModal({
      title: 'Add a new teammate',
      content: `Are you sure you want to add ${name()} as your teammate?`,
      action: () => handleAdd(),
      actionLabel: 'Add'
    });
  };

  const handleAdd = async () => {
    const user = supabase.auth.user();

    if (!user) {
      throw new Error('Adding a new member but no user');
    }

    const validation = z.string().safeParse(name());

    if (!validation.success) {
      // TODO: handle errors
      console.error(validation.error);
      return;
    }

    const { data } = validation;
    const { error } = await supabase.from('members').insert({
      user_id: user.id,
      name: data,
      is_active: true
    });

    if (error) {
      // TODO: handle errors
      console.error(error);
      return;
    }

    await getMembers({ refetch: true });
    setName('');
  };

  return (
    <div class="mt-8 flex items-center space-x-4">
      <div class="flex-1">
        <label for="name" class="block text-sm font-medium text-gray-700">
          Add a new teammate
        </label>
        <div class="mt-1">
          <input
            onInput={e => setName(e.currentTarget.value)}
            value={name()}
            type="text"
            name="name"
            id="name"
            class="shadow-sm block w-full sm:text-sm border-gray-300 rounded-md focus-default"
            placeholder="Teammate name"
          />
        </div>
      </div>
      <button
        onClick={openAddModal}
        class="mt-6 inline-flex items-center shadow-sm px-4 py-1.5 border border-gray-300 leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus-default"
      >
        Add
      </button>
    </div>
  );
};

export default AddMember;
