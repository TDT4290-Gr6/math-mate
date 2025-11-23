/**
 * Supabase Client Initialization
 *
 * This module creates and exports a Supabase client instance for interacting
 * with the Supabase backend (database, authentication, storage, etc.).
 *
 * Configuration:
 * - `NEXT_PUBLIC_SUPABASE_URL`: The Supabase project URL, loaded from environment variables.
 * - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: The Supabase public anonymous API key.
 *
 * Usage:
 * ```ts
 * import { supabase } from './supabaseClient';
 *
 * const { data, error } = await supabase.from('table_name').select('*');
 * ```
 *
 * @remarks
 * Ensure both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
 * are defined in your environment variables, otherwise the client will throw an error.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
