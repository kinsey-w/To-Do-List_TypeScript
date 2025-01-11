// Extend the global Window interface
interface Window {
  supabase: {
    createClient: (url: string, key: string) => any;
  };
}
