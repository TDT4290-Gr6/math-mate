import { createClient } from '@supabase/supabase-js';
//Supabase URL and Key from .env file is posted to teams/extramaterial/dotenv

const supabaseUrl = process.env.DATABASE_URL as string;
const supabaseKey = process.env.SUPABASE_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseKey);
