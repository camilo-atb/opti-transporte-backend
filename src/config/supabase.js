import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabaseUrlBr = process.env.SUPABASE_URL_BR;
const supabaseServiceRolKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrlBr, supabaseServiceRolKey);
export default supabase;
