import type { Component } from 'solid-js';

const AddMember: Component = () => {
  return (
    <div class="mt-8 flex items-center space-x-4">
      <div class="flex-1">
        <label for="name" class="block text-sm font-medium text-gray-700">
          Add a new teammate
        </label>
        <div class="mt-1">
          <input
            type="text"
            name="name"
            id="name"
            class="shadow-sm block w-full sm:text-sm border-gray-300 rounded-md focus-default"
            placeholder="Teammate name"
          />
        </div>
      </div>
      <button class="mt-6 inline-flex items-center shadow-sm px-4 py-1.5 border border-gray-300 leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus-default">
        Add
      </button>
    </div>
  );
};

export default AddMember;
