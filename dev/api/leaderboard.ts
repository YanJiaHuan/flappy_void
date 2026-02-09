import { adminSupabase } from './_supabase';

export default async function handler(req: any, res: any) {
  try {
    const supabase = adminSupabase();
    const limit = Math.min(parseInt((req.query?.limit as string) || '20', 10), 100);
    const { data, error } = await supabase
      .from('leaderboard')
      .select('user_id, username, best_score, avatar_url, rank')
      .order('rank', { ascending: true })
      .limit(limit);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error';
    return res.status(500).json({ error: message });
  }
}
