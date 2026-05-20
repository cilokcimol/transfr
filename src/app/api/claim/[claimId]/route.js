import { deposits } from '../../deposit/route';

export async function GET(request, { params }) {
  const { claimId } = await params;
  const deposit = deposits.get(claimId);

  if (!deposit) {
    return Response.json({
      found: false,
      message: 'Deposit not found. You can still claim directly from the smart contract.',
    });
  }

  return Response.json({
    found: true,
    claimId: deposit.claimId,
    amount: deposit.amount,
    recipientEmail: deposit.recipientEmail,
    txHash: deposit.txHash,
    sender: deposit.sender,
    claimed: deposit.claimed,
    createdAt: deposit.createdAt,
    hasPin: !!deposit.pin,
  });
}

export async function POST(request, { params }) {
  const { claimId } = await params;
  const deposit = deposits.get(claimId);

  if (!deposit) {
    return Response.json({ valid: false, error: 'Deposit not found' }, { status: 404 });
  }

  if (!deposit.pin) {
    return Response.json({ valid: true });
  }

  const body = await request.json();
  const { pin } = body;

  if (pin === deposit.pin) {
    return Response.json({ valid: true });
  }

  return Response.json({ valid: false, error: 'Incorrect PIN' }, { status: 401 });
}
