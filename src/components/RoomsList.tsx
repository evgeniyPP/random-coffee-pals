import { createSignal, For, Match, Switch } from 'solid-js';
import type { Component } from 'solid-js';
import { getRooms, rooms } from '../stores/rooms';
import { Room, RoomId } from '../models';
import { supabase } from '../utils/api';
import { openModal } from './Modal';
import { isLoading, setIsLoading } from '../stores/loading';
import { showErrorNotification } from './Notification';
import CheckIcon from './icons/CheckIcon';
import MarkIcon from './icons/MarkIcon';

const RoomsList: Component = () => {
  const [editedRoomId, setEditedRoomId] = createSignal<number | null>(null);
  const [editedRoomName, setEditedRoomName] = createSignal('');

  const handleEdit = async (room: Room) => {
    if (room.name === editedRoomName()) {
      clearEdit();
      return;
    }

    const id = editedRoomId();

    if (!id) {
      throw new Error('Updating room but no editedRoomId');
    }

    setIsLoading(true);
    const { error } = await supabase
      .from<Room>('rooms')
      .update({ name: editedRoomName() })
      .eq('id', id);

    if (error) {
      console.error(error);
      setIsLoading(false);
      showErrorNotification();
      return;
    }

    await getRooms({ refetch: true });
    clearEdit();
    setIsLoading(false);
  };

  const clearEdit = () => {
    setEditedRoomId(null);
    setEditedRoomName('');
  };

  const setEditedRoom = (room: Room) => {
    if (editedRoomId()) {
      clearEdit();
      return;
    }

    setEditedRoomId(room.id);
    setEditedRoomName(room.name);
  };

  const openDeleteModal = (room: Room) => {
    openModal({
      title: 'Delete this room?',
      content: `Are you sure you want to delete ${room.name}?`,
      type: 'danger',
      action: () => deleteRoom(room.id),
      actionLabel: 'Delete'
    });
  };

  const deleteRoom = async (id: RoomId) => {
    setIsLoading(true);
    const { error } = await supabase
      .from<Room>('rooms')
      .delete({ returning: 'minimal' })
      .eq('id', id);

    if (error) {
      console.error(error);
      setIsLoading(false);
      showErrorNotification();
      return;
    }

    await getRooms({ refetch: true });
    setIsLoading(false);
  };

  return (
    <ul id="rooms-list" role="list" class="divide-y divide-gray-200 sm:pr-2">
      <For each={rooms()}>
        {room => (
          <li class="py-4">
            <div class="flex flex-col sm:flex-row gap-4 items-center space-x-4">
              <div class="flex-1 min-w-0">
                <Switch>
                  <Match when={editedRoomId() !== room.id}>
                    <p class="font-medium">{room.name}</p>
                  </Match>
                  <Match when={editedRoomId() === room.id}>
                    <div>
                      <label for="name" class="sr-only">
                        Room's name
                      </label>
                      <div class="mt-1 flex flex-col rounded-md shadow-sm -space-y-px">
                        <div class="flex">
                          <input
                            onInput={e => setEditedRoomName(e.currentTarget.value)}
                            value={editedRoomName()}
                            disabled={isLoading()}
                            type="text"
                            name="name"
                            id="name"
                            class="block w-full rounded-none rounded-l-md sm:text-sm border-gray-300 focus-default dark:bg-gray-900"
                            placeholder={room.name}
                          />
                          <button
                            onClick={() => handleEdit(room)}
                            disabled={isLoading() || !editedRoomName().length}
                            class="-ml-px relative px-4 py-2 border border-gray-300 text-sm font-medium btn-default focus-default"
                          >
                            <span class="sr-only">Update room</span>
                            <CheckIcon size={4} />
                          </button>
                          <button
                            onClick={() => clearEdit()}
                            disabled={isLoading()}
                            class="-ml-px relative px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md btn-default focus-default"
                          >
                            <span class="sr-only">Cancel update</span>
                            <MarkIcon size={4} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Match>
                </Switch>
              </div>
              <div class="flex gap-1">
                <button
                  onClick={() => setEditedRoom(room)}
                  disabled={isLoading() || !!editedRoomId()}
                  class="shadow-sm px-2.5 py-0.5 border border-yellow-300 text-sm leading-5 font-medium rounded-full btn-default dark:border-yellow-600 focus-default"
                >
                  Edit
                </button>
                <button
                  onClick={() => openDeleteModal(room)}
                  disabled={isLoading() || !!editedRoomId()}
                  class="shadow-sm px-2.5 py-0.5 border border-red-300 text-sm leading-5 font-medium rounded-full btn-default dark:border-red-900 focus-default"
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

export default RoomsList;
