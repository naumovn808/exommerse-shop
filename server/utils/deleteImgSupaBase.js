// import supabase from "./supabase";
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
)


const deleteImgSupaBase = async (publicId) => {
    try {
        if (!publicId) {
            throw new Error('No public ID provided for deletion')
        }

        const { data, error } = await supabase.storage
            .from(process.env.SUPABASE_BACKET)
            .remove([publicId])

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error deleting image:', error);
        throw error;
    }
}

export default deleteImgSupaBase