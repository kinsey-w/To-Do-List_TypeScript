const supabaseUrl: string = "URL_DE_VOTRE_PROJET_SUPABASE";
const supabaseKey: string = "CLÉ_ANONYME";

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

export default supabase;