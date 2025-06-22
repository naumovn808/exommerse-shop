import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

const uploadImgSupaBase = async (image, path) => {
    try {
        const buffer = image?.buffer || Buffer.from(await image.arrayBuffer());
        const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.png`;
        const filePath = `${path}/${fileName}`;

        const { data, error } = await supabase.storage
            .from(process.env.SUPABASE_BUCKET)
            .upload(filePath, buffer, {
                contentType: image.mimetype || 'image/png',
            });

        if (error) throw error;

        return data;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

export default uploadImgSupaBase;