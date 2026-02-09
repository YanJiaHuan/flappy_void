import { adminSupabase } from './_supabase';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const supabase = adminSupabase();
    const authHeader = req.headers?.authorization as string | undefined;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ error: 'Missing authorization token' });
    }

    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) {
      return res.status(401).json({ error: 'Invalid user token' });
    }

    const score = Number(req.body?.score ?? 0);
    if (!Number.isFinite(score) || score < 0) {
      return res.status(400).json({ error: 'Invalid score' });
    }

    const userId = userData.user.id;

    const { error: scoreError } = await supabase
      .from('scores')
      .insert({ user_id: userId, score });

    if (scoreError) {
      return res.status(500).json({ error: scoreError.message });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('best_score')
      .eq('id', userId)
      .single();

    if (profileError) {
      return res.status(500).json({ error: profileError.message });
    }

    const nextBest = Math.max(profile.best_score ?? 0, score);
    if (nextBest !== profile.best_score) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ best_score: nextBest })
        .eq('id', userId);

      if (updateError) {
        return res.status(500).json({ error: updateError.message });
      }
    }

    return res.status(200).json({ best_score: nextBest });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error';
    return res.status(500).json({ error: message });
  }
}
