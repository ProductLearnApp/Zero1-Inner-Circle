import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import type { QRPayload } from '@/lib/qr'
import { AttendeeStatus } from '@prisma/client'

/**
 * Hybrid verification strategy:
 *
 * 1. Decode the JWT without signature verification to extract attendeeId + passType.
 * 2. Load the attendee from the DB.
 * 3. Compare the presented token to the stored qrPayload / plusOneQrPayload.
 *    An exact DB match is the primary trust anchor — it works even if QR_SECRET
 *    was rotated, while still preventing forged tokens (attacker would need to
 *    know the exact stored JWT string).
 * 4. If the DB match succeeds, also attempt JWT signature verification and log
 *    any mismatch server-side as a warning (useful for diagnosing secret drift).
 */
export async function POST(req: NextRequest) {
  // #region agent log
  const startTime = Date.now();
  fetch('http://127.0.0.1:7298/ingest/0434cb40-b565-43ab-811b-3430eeb9d9f9',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'a8b584'},body:JSON.stringify({sessionId:'a8b584',location:'verify/route.ts:19',message:'Check-in verify started',data:{hasSecret:!!process.env.QR_SECRET,secretLength:process.env.QR_SECRET?.length},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  try {
    const { token } = await req.json() as { token: string }
    // #region agent log
    fetch('http://127.0.0.1:7298/ingest/0434cb40-b565-43ab-811b-3430eeb9d9f9',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'a8b584'},body:JSON.stringify({sessionId:'a8b584',location:'verify/route.ts:25',message:'Token received',data:{tokenLength:token?.length,tokenPrefix:token?.slice(0,20)},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    if (!token) return Response.json({ error: 'token required' }, { status: 400 })

    // Step 1: decode without verifying signature
    let decoded: QRPayload | null = null
    try {
      decoded = jwt.decode(token) as QRPayload
      // #region agent log
      fetch('http://127.0.0.1:7298/ingest/0434cb40-b565-43ab-811b-3430eeb9d9f9',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'a8b584'},body:JSON.stringify({sessionId:'a8b584',location:'verify/route.ts:35',message:'Token decoded',data:{attendeeId:decoded?.attendeeId,passType:decoded?.passType,eventId:decoded?.eventId},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
    } catch (decodeErr) {
      // malformed token — not even decodable
      // #region agent log
      fetch('http://127.0.0.1:7298/ingest/0434cb40-b565-43ab-811b-3430eeb9d9f9',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'a8b584'},body:JSON.stringify({sessionId:'a8b584',location:'verify/route.ts:40',message:'Token decode failed',data:{error:String(decodeErr)},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
    }

    if (!decoded?.attendeeId || !decoded?.passType) {
      // #region agent log
      fetch('http://127.0.0.1:7298/ingest/0434cb40-b565-43ab-811b-3430eeb9d9f9',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'a8b584'},body:JSON.stringify({sessionId:'a8b584',location:'verify/route.ts:46',message:'Invalid QR - missing fields',data:{hasAttendeeId:!!decoded?.attendeeId,hasPassType:!!decoded?.passType},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      return Response.json({ status: 'INVALID_QR', message: 'Unrecognised QR code' }, { status: 400 })
    }

    // Step 2: load attendee
    const dbStart = Date.now();
    const attendee = await prisma.attendee.findUnique({
      where: { id: decoded.attendeeId },
      include: { event: true },
    })
    // #region agent log
    fetch('http://127.0.0.1:7298/ingest/0434cb40-b565-43ab-811b-3430eeb9d9f9',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'a8b584'},body:JSON.stringify({sessionId:'a8b584',location:'verify/route.ts:58',message:'DB lookup complete',data:{found:!!attendee,attendeeStatus:attendee?.status,dbTimeMs:Date.now()-dbStart},timestamp:Date.now()})}).catch(()=>{});
    // #endregion

    if (!attendee) {
      return Response.json({ status: 'NOT_FOUND', message: 'Pass not found' }, { status: 404 })
    }

    // Step 3: DB token match (primary trust anchor)
    const expectedToken =
      decoded.passType === 'plusone' ? attendee.plusOneQrPayload : attendee.qrPayload
    const tokensMatch = token === expectedToken;
    // #region agent log
    fetch('http://127.0.0.1:7298/ingest/0434cb40-b565-43ab-811b-3430eeb9d9f9',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'a8b584'},body:JSON.stringify({sessionId:'a8b584',location:'verify/route.ts:75',message:'Token comparison',data:{hasExpectedToken:!!expectedToken,tokensMatch,expectedTokenLength:expectedToken?.length,receivedTokenLength:token.length},timestamp:Date.now()})}).catch(()=>{});
    // #endregion

    if (!expectedToken || token !== expectedToken) {
      console.error(
        `[checkin/verify] Token mismatch for attendee ${attendee.id} (passType=${decoded.passType}). ` +
        'QR may be outdated — admin used Refresh QR after this pass was shared.',
      )
      return Response.json({ status: 'INVALID_QR', message: 'QR code is outdated or invalid' }, { status: 400 })
    }

    // Step 4: attempt JWT signature verification (non-blocking — log warning if it fails)
    const secret = process.env.QR_SECRET
    if (secret) {
      try {
        jwt.verify(token, secret, { algorithms: ['HS256'] })
      } catch (sigErr) {
        console.warn(
          `[checkin/verify] JWT signature invalid for attendee ${attendee.id} — ` +
          'DB match succeeded so check-in is allowed, but QR_SECRET may have changed. ' +
          `Error: ${sigErr}`,
        )
      }
    }

    if (attendee.eventId !== decoded.eventId) {
      return Response.json({ status: 'WRONG_EVENT', message: 'Wrong event' }, { status: 400 })
    }

    if (
      attendee.status !== AttendeeStatus.SELECTED &&
      attendee.status !== AttendeeStatus.CHECKED_IN
    ) {
      const msg = attendee.status === AttendeeStatus.REJECTED
        ? 'This pass has been rejected'
        : 'Not on the list'
      return Response.json({ status: 'NOT_SELECTED', message: msg }, { status: 403 })
    }

    if (decoded.passType === 'primary') {
      // Atomic conditional update — prevents race condition on simultaneous scans
      const result = await prisma.attendee.updateMany({
        where: { id: attendee.id, checkedIn: false },
        data: { checkedIn: true, checkedInAt: new Date(), status: AttendeeStatus.CHECKED_IN },
      })

      if (result.count === 0) {
        // Already checked in by a concurrent request
        const fresh = await prisma.attendee.findUnique({ where: { id: attendee.id } })
        return Response.json({
          status: 'ALREADY_CHECKED_IN',
          passType: 'primary',
          attendee: sanitize(fresh!),
          checkedInAt: fresh!.checkedInAt,
        })
      }

      const updated = await prisma.attendee.findUnique({ where: { id: attendee.id } })
      // #region agent log
      fetch('http://127.0.0.1:7298/ingest/0434cb40-b565-43ab-811b-3430eeb9d9f9',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'a8b584'},body:JSON.stringify({sessionId:'a8b584',location:'verify/route.ts:105',message:'Primary check-in SUCCESS',data:{totalTimeMs:Date.now()-startTime},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      return Response.json({ status: 'SUCCESS', passType: 'primary', attendee: sanitize(updated!) })
    }

    if (decoded.passType === 'plusone') {
      if (!attendee.plusOneName) {
        return Response.json({ status: 'NO_PLUS_ONE', message: 'No +1 registered' }, { status: 400 })
      }

      // Atomic conditional update for +1
      const result = await prisma.attendee.updateMany({
        where: { id: attendee.id, plusOneCheckedIn: false },
        data: { plusOneCheckedIn: true, plusOneCheckedInAt: new Date() },
      })

      if (result.count === 0) {
        const fresh = await prisma.attendee.findUnique({ where: { id: attendee.id } })
        return Response.json({
          status: 'ALREADY_CHECKED_IN',
          passType: 'plusone',
          attendee: sanitize(fresh!),
          checkedInAt: fresh!.plusOneCheckedInAt,
        })
      }

      const updated = await prisma.attendee.findUnique({ where: { id: attendee.id } })
      // #region agent log
      fetch('http://127.0.0.1:7298/ingest/0434cb40-b565-43ab-811b-3430eeb9d9f9',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'a8b584'},body:JSON.stringify({sessionId:'a8b584',location:'verify/route.ts:135',message:'PlusOne check-in SUCCESS',data:{totalTimeMs:Date.now()-startTime},timestamp:Date.now()})}).catch(()=>{});
      // #endregion
      return Response.json({ status: 'SUCCESS', passType: 'plusone', attendee: sanitize(updated!) })
    }

    // #region agent log
    fetch('http://127.0.0.1:7298/ingest/0434cb40-b565-43ab-811b-3430eeb9d9f9',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'a8b584'},body:JSON.stringify({sessionId:'a8b584',location:'verify/route.ts:140',message:'Unknown pass type',data:{passType:decoded.passType},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    return Response.json({ status: 'INVALID_QR', message: 'Unknown pass type' }, { status: 400 })
  } catch (e) {
    // #region agent log
    fetch('http://127.0.0.1:7298/ingest/0434cb40-b565-43ab-811b-3430eeb9d9f9',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'a8b584'},body:JSON.stringify({sessionId:'a8b584',location:'verify/route.ts:144',message:'Unexpected error',data:{error:String(e),totalTimeMs:Date.now()-startTime},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    console.error('[checkin/verify] Unexpected error:', e)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

type AttendeeRow = {
  id: string; name: string; phone: string; status: AttendeeStatus
  seatLabel: string | null; checkedIn: boolean; checkedInAt: Date | null
  plusOneName: string | null; plusOnePhone: string | null
  plusOneCheckedIn: boolean; plusOneCheckedInAt: Date | null
}

function sanitize(a: AttendeeRow) {
  return {
    id: a.id,
    name: a.name,
    phone: a.phone,
    status: a.status,
    seatLabel: a.seatLabel,
    checkedIn: a.checkedIn,
    checkedInAt: a.checkedInAt,
    plusOneName: a.plusOneName,
    plusOnePhone: a.plusOnePhone,
    plusOneCheckedIn: a.plusOneCheckedIn,
    plusOneCheckedInAt: a.plusOneCheckedInAt,
  }
}
