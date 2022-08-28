import { useNavigate } from '@solidjs/router';
import { Component, createSignal, Show } from 'solid-js';
import { ZodIssue } from 'zod';
import { showErrorNotification } from '../components/Notification';
import { NewUserSchema } from '../schemas';
import { isLoading, setIsLoading } from '../stores/loading';
import { supabase } from '../utils/api';
import { validation } from '../utils/validation';

const SignIn: Component = () => {
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = createSignal<ZodIssue[]>();

  if (supabase.auth.user()?.id) {
    navigate('/', { replace: true });
  }

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const values = Object.fromEntries(formData.entries()) as Record<string, string>;

    const validation = NewUserSchema.safeParse(values);

    if (!validation.success) {
      setValidationErrors(validation.error.issues);
      return;
    }

    setIsLoading(true);
    const { data } = validation;
    const { error } = await supabase.auth.signIn({
      email: data.email,
      password: data.password
    });

    if (error) {
      console.error(error);
      setIsLoading(false);
      showErrorNotification(error.message);
      return;
    }

    setIsLoading(false);
    navigate('/', { replace: true });
  };

  const { hasError, getError } = validation(validationErrors);

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
            <form onSubmit={handleSubmit} novalidate class="space-y-6">
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <div class="mt-1 relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autocomplete="email"
                    disabled={isLoading()}
                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus-default sm:text-sm"
                    classList={{ error: hasError('email') }}
                  />
                  <Show when={hasError('email')}>
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg
                        class="h-5 w-5 text-red-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                  </Show>
                </div>
                <Show when={hasError('email')}>
                  <p class="mt-2 text-sm text-red-600" id="email-error">
                    {getError('email')}
                  </p>
                </Show>
              </div>

              <div>
                <label for="password" class="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div class="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    disabled={isLoading()}
                    autocomplete="current-password"
                    class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus-default sm:text-sm"
                    classList={{ error: hasError('password') }}
                  />
                  <Show when={hasError('password')}>
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg
                        class="h-5 w-5 text-red-500"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </div>
                  </Show>
                </div>
                <Show when={hasError('password')}>
                  <p class="mt-2 text-sm text-red-600" id="email-error">
                    {getError('password')}
                  </p>
                </Show>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading()}
                  class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-700 hover:bg-yellow-800 focus-default"
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
