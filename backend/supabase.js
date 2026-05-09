import dotenv from "dotenv";
dotenv.config();

import { createClient } from "@supabase/supabase-js";
import process from "node:process";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
);

export default supabase;
