import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { computeSignature } from '@/lib/jyotish';
import { getLifePathNumber, getExpressionNumber, getSoulUrgeNumber } from '@/lib/numerology';

export async function GET() {
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json([]);

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });

  const body = await req.json();
  const { name, relationship, dob, birth_time, birth_place, notes } = body;

  if (!name || !dob) {
    return NextResponse.json({ error: 'Name and DOB required' }, { status: 400 });
  }

  const birthTimeKnown = !!birth_time;
  const time = birth_time || '12:00';

  const signature = await computeSignature(name, dob, time, birth_place || '');
  const lifePath = getLifePathNumber(dob);
  const expression = getExpressionNumber(name);
  const soulUrge = getSoulUrgeNumber(name);

  const { data, error } = await supabase
    .from('profiles')
    .insert({
      name,
      relationship: relationship || 'other',
      dob,
      birth_time: birth_time || null,
      birth_place: birth_place || null,
      birth_time_known: birthTimeKnown,
      signature,
      life_path: lifePath,
      expression,
      soul_urge: soulUrge,
      notes: notes || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
