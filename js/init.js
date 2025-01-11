const supabaseUrl = "URL_DE_VOTRE_PROJET_SUPABASE";
const supabaseKey = "CLÉ_ANONYME";
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
export default supabase;
