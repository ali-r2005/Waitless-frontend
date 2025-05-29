import Pusher from 'pusher-js';
import Echo from 'laravel-echo';

// Define window augmentation for TypeScript
declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: Echo<any>;
  }
}

/**
 * Get the authentication token from storage
 * @returns The authentication token or null if not found
 */
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null; // Return null in server-side context
  }
  
  // First check localStorage for the token
  const token = localStorage.getItem('auth_token');
  if (token) {
    return token;
  }
  
  // If not in localStorage, check sessionStorage
  return sessionStorage.getItem('auth_token');
};

/**
 * Initialize Pusher and Echo with the token
 * @returns The Echo instance
 */
const initPusher = () => {
  // Only initialize in browser environment
  if (typeof window !== 'undefined') {
    const token = getAuthToken();
    if (!token) {
      console.error('No authentication token found');
      throw new Error('Authentication token is required to initialize Echo');
    }
    
    window.Pusher = Pusher;

    window.Echo = new Echo<any>({
      broadcaster: 'pusher',
      key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
      authEndpoint: process.env.NEXT_PUBLIC_API_URL + '/broadcasting/auth',
      auth: {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      },
      forceTLS: true
    });

    return window.Echo;
  }

  throw new Error('Pusher can only be initialized in browser environment');
};

/**
 * Get any channel by name
 * @param channelName Name of the channel to subscribe to
 * @returns The channel instance
 */
export const getChannel = (channelName: string) => {
  // Initialize Echo if it doesn't exist yet
  if (typeof window !== 'undefined' && !window.Echo) {
    initPusher();
  }
  
  return window.Echo.channel(channelName);
};

/**
 * Get private channel by name
 * @param channelName Name of the private channel to subscribe to
 * @returns The private channel instance
 */
export const getPrivateChannel = (channelName: string) => {
  // Initialize Echo if it doesn't exist yet
  if (typeof window !== 'undefined' && !window.Echo) {
    initPusher();
  }
  
  return window.Echo.private(channelName);
};

/**
 * Get presence channel by name
 * @param channelName Name of the presence channel to join
 * @returns The presence channel instance
 */
export const getPresenceChannel = (channelName: string) => {
  // Initialize Echo if it doesn't exist yet
  if (typeof window !== 'undefined' && !window.Echo) {
    initPusher();
  }
  
  return window.Echo.join(channelName);
};

/**
 * Get the Echo instance
 * @returns The Echo instance
 */
export const getEcho = () => {
  if (typeof window !== 'undefined' && !window.Echo) {
    initPusher();
  }
  
  return window.Echo;
};

// Export the initialize function
export default initPusher;
