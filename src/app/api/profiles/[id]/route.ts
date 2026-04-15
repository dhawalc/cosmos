import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { computeSignature } from '@/lib/jyotish';
import { getLifePathNumber, getExpressionNumber, getSoulUrgeNumber } from '@/lib/numerology';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });

  const { id } = await params;
  const body = await req.json();
  const { name, relationship, dob, birth_time, birth_place, notes } = body;

  const birthTimeKnown = !!birth_time;
  const time = birth_time || '12:00';

  const signature = await computeSignature(name, dob, time, birth_place || '');
  const lifePath = getLifePathNumber(dob);
  const expression = getExpressionNumber(name);
  const soulUrge = getSoulUrgeNumber(name);

  const { data, error } = await supabase
    .from('profiles')
    .update({
      name,
      relationship,
      dob,
      birth_time: birth_time || null,
      birth_place: birth_place || null,
      birth_time_known: birthTimeKnown,
      signature,
      life_path: lifePath,
      expression,
      soul_urge: soulUrge,
      notes: notes || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: 'Database not configured' }, { status: 503 });

  const { id } = await params;
  const { error } = await supabase.from('profiles').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
