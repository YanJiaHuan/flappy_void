import { supabase } from './supabase';

export type Profile = {
  id: string;
  username: string;
  best_score: number;
  avatar_url: string | null;
};

export type LeaderboardEntry = {
  user_id: string;
  username: string;
  best_score: number;
  avatar_url: string | null;
  rank: number;
};

export async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, best_score, avatar_url')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as Profile | null;
}

export async function upsertProfile(profile: Profile) {
  const { error } = await supabase
    .from('profiles')
    .upsert(profile, { onConflict: 'id' });

  if (error) {
    throw error;
  }
}

export async function recordScore(userId: string, score: number) {
  const { error: scoreError } = await supabase
    .from('scores')
    .insert({ user_id: userId, score });

  if (scoreError) {
    throw scoreError;
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('best_score')
    .eq('id', userId)
    .single();

  if (profileError) {
    throw profileError;
  }

  const nextBest = Math.max(profile.best_score ?? 0, score);
  if (nextBest !== profile.best_score) {
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ best_score: nextBest })
      .eq('id', userId);

    if (updateError) {
      throw updateError;
    }
  }

  return nextBest;
}

export async function fetchLeaderboard(limit = 20) {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('user_id, username, best_score, avatar_url, rank')
    .order('rank', { ascending: true })
    .limit(limit);

  if (error) {
    throw error;
  }

  return (data ?? []) as LeaderboardEntry[];
}

export async function fetchUserRank(userId: string) {
  const { data, error } = await supabase
    .rpc('get_user_rank', { uid: userId });

  if (error) {
    throw error;
  }

  return data as number | null;
}
