import { NextResponse } from 'next/server';
import { computeSignature } from '@/lib/jyotish';
import { getLifePathNumber, getExpressionNumber, getSoulUrgeNumber } from '@/lib/numerology';

export async function POST(req: Request) {
  try {
    const { name, dob, time, place } = await req.json();

    if (!name || !dob) {
      return NextResponse.json({ error: "Name and DOB are required." }, { status: 400 });
    }

    const signature = await computeSignature(name, dob, time, place);
    const lifePath = getLifePathNumber(dob);
    const expression = getExpressionNumber(name);
    const soulUrge = getSoulUrgeNumber(name);

    return NextResponse.json({ signature, lifePath, expression, soulUrge });
  } catch (_error) {
    return NextResponse.json({ error: "Failed to compute signature." }, { status: 500 });
  }
}
