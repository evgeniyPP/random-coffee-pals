import { createSignal, For, Match, onMount, Switch } from 'solid-js';
import type { Component } from 'solid-js';
import { getMembers, members } from '../stores/members';
import { Member } from '../models';
import { supabase } from '../utils/api';

const MembersList: Component = () => {
  const [editedMemberId, setEditedMemberId] = createSignal<number | null>(null);
  const [editedMemberName, setEditedMemberName] = createSignal('');

  onMount(async () => {
    await getMembers();
  });

  const handleUserStatus = async (member: Member) => {
    const { error } = await supabase
      .from('members')
      .update({ is_active: !member.is_active })
      .eq('id', member.id);

    if (error) {
      // TODO: handle errors
      console.error(error);
      return;
    }

    await getMembers({ refetch: true });
  };

  const handleEdit = async (member: Member) => {
    if (member.name === editedMemberName()) {
      setEditedMemberId(null);
      setEditedMemberName('');
      return;
    }

    const { error } = await supabase
      .from('members')
      .update({ name: editedMemberName() })
      .eq('id', editedMemberId());

    if (error) {
      // TODO: handle errors
      console.error(error);
      return;
    }

    await getMembers({ refetch: true });
    setEditedMemberId(null);
    setEditedMemberName('');
  };

  const setEditedMember = (member: Member) => {
    setEditedMemberId(member.id);
    setEditedMemberName(member.name);
  };

  return (
    <ul role="list" class="divide-y divide-gray-200">
      <For each={members()}>
        {member => (
          <li class="py-4">
            <div class="flex items-center space-x-4">
              <div class="flex-1 min-w-0">
                <Switch>
                  <Match when={editedMemberId() !== member.id}>
                    <p
                      class="font-medium text-gray-900"
                      classList={{ 'line-through': !member.is_active }}
                    >
                      {member.name}
                    </p>
                  </Match>
                  <Match when={editedMemberId() === member.id}>
                    <div>
                      <label for="name" class="sr-only">
                        Teammate name
                      </label>
                      <div class="mt-1 flex rounded-md shadow-sm">
                        <input
                          onInput={e => setEditedMemberName(e.currentTarget.value)}
                          value={editedMemberName()}
                          type="text"
                          name="name"
                          id="name"
                          class="focus:ring-yellow-500 focus:border-yellow-500 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                          placeholder={member.name}
                        />
                        <button
                          onClick={() => handleEdit(member)}
                          class="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            class="w-4 h-4"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M3 13.5l6.75 6.75L21 4.5"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </Match>
                </Switch>
              </div>
              <div class="flex gap-1">
                <Switch>
                  <Match when={member.is_active}>
                    <button
                      onClick={() => handleUserStatus(member)}
                      class="inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Make inactive
                    </button>
                  </Match>
                  <Match when={!member.is_active}>
                    <button
                      onClick={() => handleUserStatus(member)}
                      class="inline-flex items-center shadow-sm px-2.5 py-0.5 border border-green-300 text-sm leading-5 font-medium rounded-full text-green-700 bg-white hover:bg-green-50"
                    >
                      Make active
                    </button>
                  </Match>
                </Switch>
                <button
                  onClick={() => setEditedMember(member)}
                  class="inline-flex items-center shadow-sm px-2.5 py-0.5 border border-yellow-300 text-sm leading-5 font-medium rounded-full text-yellow-700 bg-white hover:bg-yellow-50"
                >
                  Edit
                </button>
                <button class="inline-flex items-center shadow-sm px-2.5 py-0.5 border border-red-300 text-sm leading-5 font-medium rounded-full text-red-700 bg-white hover:bg-red-50">
                  Delete
                </button>
              </div>
            </div>
          </li>
        )}
      </For>
    </ul>
  );
};

export default MembersList;
