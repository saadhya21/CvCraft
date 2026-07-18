import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!

if (!supabaseUrl || !supabaseKey) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_KEY must be set')
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
})

export async function uploadFile(buffer: Buffer, fileName: string, mimeType: string): Promise<string> {
  const bucket = process.env.SUPABASE_BUCKET || 'resumes'

  const { error } = await supabase.storage.from(bucket).upload(fileName, buffer, {
    contentType: mimeType,
    upsert: false,
  })

  if (error) throw new Error(`Supabase upload failed: ${error.message}`)

  const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(fileName)

  return publicUrl.publicUrl
}
