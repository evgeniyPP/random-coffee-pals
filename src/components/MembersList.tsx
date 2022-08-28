import { createSignal, For, Match, Show, Switch } from 'solid-js';
import type { Component } from 'solid-js';
import { getMembers, members } from '../stores/members';
import { Member, MemberId } from '../models';
import { supabase } from '../utils/api';
import { openModal } from './Modal';
import { isLoading, setIsLoading } from '../stores/loading';
import { showErrorNotification } from './Notification';

const MembersList: Component = () => {
  const [editedMemberId, setEditedMemberId] = createSignal<number | null>(null);
  const [editedMemberName, setEditedMemberName] = createSignal('');
  const [editedMemberContact, setEditedMemberContact] = createSignal('');

  const handleUserStatus = async (member: Member) => {
    setIsLoading(true);
    const { error } = await supabase
      .from<Member>('members')
      .update({ is_active: !member.is_active }, { returning: 'minimal' })
      .eq('id', member.id);

    if (error) {
      console.error(error);
      setIsLoading(false);
      showErrorNotification();
      return;
    }

    await getMembers({ refetch: true });
    setIsLoading(false);
  };

  const handleEdit = async (member: Member) => {
    if (member.name === editedMemberName() && member.contact === editedMemberContact()) {
      clearEdit();
      return;
    }

    const id = editedMemberId();

    if (!id) {
      throw new Error('Updating member but no editedMemberId');
    }

    setIsLoading(true);
    const { error } = await supabase
      .from<Member>('members')
      .update({ name: editedMemberName(), contact: editedMemberContact() || null })
      .eq('id', id);

    if (error) {
      console.error(error);
      setIsLoading(false);
      showErrorNotification();
      return;
    }

    await getMembers({ refetch: true });
    clearEdit();
    setIsLoading(false);
  };

  const clearEdit = () => {
    setEditedMemberId(null);
    setEditedMemberName('');
    setEditedMemberContact('');
  };

  const setEditedMember = (member: Member) => {
    if (editedMemberId()) {
      clearEdit();
      return;
    }

    setEditedMemberId(member.id);
    setEditedMemberName(member.name);
    setEditedMemberContact(member.contact ?? '');
  };

  const openDeleteModal = (member: Member) => {
    openModal({
      title: 'Delete your pal?',
      content: `Are you sure you want to delete ${member.name}?`,
      type: 'danger',
      action: () => deleteMember(member.id),
      actionLabel: 'Delete'
    });
  };

  const deleteMember = async (id: MemberId) => {
    setIsLoading(true);
    const { error } = await supabase
      .from<Member>('members')
      .delete({ returning: 'minimal' })
      .eq('id', id);

    if (error) {
      console.error(error);
      setIsLoading(false);
      showErrorNotification();
      return;
    }

    await getMembers({ refetch: true });
    setIsLoading(false);
  };

  return (
    <ul
      id="members-list"
      role="list"
      class="divide-y divide-gray-200 mt-8 max-h-[615px] overflow-auto pr-2"
    >
      <For each={members()}>
        {member => (
          <li class="py-4">
            <div class="flex flex-col sm:flex-row gap-4 items-center space-x-4">
              <div class="flex-1 min-w-0">
                <Switch>
                  <Match when={editedMemberId() !== member.id}>
                    <p
                      class="font-medium text-gray-900"
                      classList={{ 'line-through': !member.is_active }}
                    >
                      {member.name}
                    </p>
                    <Show when={member.contact}>
                      <p class="text-sm text-gray-500">{member.contact}</p>
                    </Show>
                  </Match>
                  <Match when={editedMemberId() === member.id}>
                    <div>
                      <label for="name" class="sr-only">
                        Pal's name
                      </label>
                      <div class="mt-1 flex flex-col rounded-md shadow-sm -space-y-px">
                        <div class="flex">
                          <input
                            onInput={e => setEditedMemberName(e.currentTarget.value)}
                            value={editedMemberName()}
                            disabled={isLoading()}
                            type="text"
                            name="name"
                            id="name"
                            class="block w-full rounded-none rounded-tl-md sm:text-sm border-gray-300 focus-default"
                            placeholder={member.name}
                          />
                          <button
                            onClick={() => handleEdit(member)}
                            disabled={isLoading() || !editedMemberName().length}
                            class="-ml-px relative px-4 py-2 border border-gray-300 text-sm font-medium rounded-tr-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus-default"
                          >
                            <span class="sr-only">Update pal</span>
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

                        <div class="flex">
                          <input
                            onInput={e => setEditedMemberContact(e.currentTarget.value)}
                            value={editedMemberContact()}
                            disabled={isLoading()}
                            type="text"
                            name="name"
                            id="name"
                            class="block w-full rounded-none rounded-bl-md sm:text-sm border-gray-300 focus-default"
                            placeholder={member.contact ?? "Pal's contact"}
                          />
                          <button
                            onClick={() => clearEdit()}
                            disabled={isLoading()}
                            class="-ml-px relative px-4 py-2 border border-gray-300 text-sm font-medium rounded-br-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus-default"
                          >
                            <span class="sr-only">Cancel update</span>
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
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
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
                      disabled={isLoading() || !!editedMemberId()}
                      class="shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus-default"
                    >
                      Make inactive
                    </button>
                  </Match>
                  <Match when={!member.is_active}>
                    <button
                      onClick={() => handleUserStatus(member)}
                      disabled={isLoading() || !!editedMemberId()}
                      class="shadow-sm px-2.5 py-0.5 border border-green-300 text-sm leading-5 font-medium rounded-full text-green-700 bg-white hover:bg-green-50 focus-default"
                    >
                      Make active
                    </button>
                  </Match>
                </Switch>
                <button
                  onClick={() => setEditedMember(member)}
                  disabled={isLoading() || !!editedMemberId()}
                  class="shadow-sm px-2.5 py-0.5 border border-yellow-300 text-sm leading-5 font-medium rounded-full text-yellow-700 bg-white hover:bg-yellow-50 focus-default"
                >
                  Edit
                </button>
                <button
                  onClick={() => openDeleteModal(member)}
                  disabled={isLoading() || !!editedMemberId()}
                  class="shadow-sm px-2.5 py-0.5 border border-red-300 text-sm leading-5 font-medium rounded-full text-red-700 bg-white hover:bg-red-50 focus-default"
                >
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
