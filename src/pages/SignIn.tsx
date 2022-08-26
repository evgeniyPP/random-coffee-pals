import { useNavigate } from '@solidjs/router';
import type { Component } from 'solid-js';
import { NewUserSchema } from '../schemas';
import { supabase } from '../utils/api';

const SignIn: Component = () => {
  const navigate = useNavigate();

  if (supabase.auth.user()?.id) {
    navigate('/', { replace: true });
  }

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const values = Object.fromEntries(formData.entries()) as Record<string, string>;

    const validation = NewUserSchema.safeParse(values);

    if (!validation.success) {
      // TODO: handle errors
      console.error(validation.error);
      return;
    }

    const { data } = validation;
    const { error } = await supabase.auth.signIn({
      email: data.email,
      password: data.password
    });

    if (error) {
      // TODO: handle errors
      console.error(error);
      return;
    }

    window.location.href = '/';
  };

  return (
    <>
      <div class="min-h-screen flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            If you want to sign up,
            <a
              href="mailto:aysanru@gmail.com"
              class="font-medium text-yellow-700 hover:text-yellow-600"
            >
              {' '}
              contact me
            </a>
          </p>
        </div>

        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div class="bg-white py-8 px-4 sm:rounded-lg sm:px-10">
            <form onSubmit={handleSubmit} class="space-y-6">
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div class="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autocomplete="email"
                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-600 focus:border-yellow-600 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label for="password" class="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div class="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autocomplete="current-password"
                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-600 focus:border-yellow-600 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-700 hover:bg-yellow-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-600"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
