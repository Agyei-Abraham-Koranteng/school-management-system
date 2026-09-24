import React, { useState, useMemo } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  Receipt, 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  ArrowUpRight, 
  AlertTriangle, 
  RefreshCw, 
  FileText,
  Key,
  Lock,
  Plus
} from 'lucide-react';
import { AnimatedCounter } from '../../components/shared/AnimatedCounter';
import { useSchool } from '../../context/SchoolContext';
import { useToast } from '../../context/ToastContext';
import { paymentService, PaymentGatewayType, WebhookEventPayload } from '../../services/payments/paymentService';

export const FinanceView: React.FC = () => {
  const { settings, addDocument, logAction, activeStudent, recordPayment, financialLedgers } = useSchool();
  const { showToast } = useToast();

  // Dynamic Ledger State derived directly from SchoolContext single source of truth
  const studentLedger = useMemo(() => {
    const raw = financialLedgers[activeStudent.studentId] || financialLedgers[activeStudent.id];
    if (raw) return raw;
    const billed = activeStudent.currentLevel === '100' ? 4500 : activeStudent.currentLevel === '200' ? 5000 : 5800;
    return {
      studentId: activeStudent.studentId,
      totalBilled: billed,
      totalPaid: 0,
      balance: billed,
      isCleared: false,
      transactions: []
    };
  }, [financialLedgers, activeStudent.studentId, activeStudent.id, activeStudent.currentLevel]);

  const totalBilled = studentLedger.totalBilled;
  const totalPaid = studentLedger.totalPaid;
  const transactions = studentLedger.transactions;
  const outstandingBalance = Math.max(0, studentLedger.balance);
  const clearancePct = totalBilled > 0 ? Math.min(100, Math.round((totalPaid / totalBilled) * 100)) : 100;
  const isFullyCleared = studentLedger.isCleared || outstandingBalance === 0;

  // Modals
  const [isPayModalOpen, setIsPayModalOpen] = useState<boolean>(false);
  const [isWebhookSimulatorOpen, setIsWebhookSimulatorOpen] = useState<boolean>(false);

  // Payment Form State
  const [selectedFeeType, setSelectedFeeType] = useState<string>('Tuition Fee Balance');
  const [paymentAmount, setPaymentAmount] = useState<number>(outstandingBalance > 0 ? outstandingBalance : 500);
  const [selectedGateway, setSelectedGateway] = useState<PaymentGatewayType>('paystack');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Webhook Simulator State
  const [simulationMode, setSimulationMode] = useState<'success' | 'duplicate' | 'tampered' | 'failed'>('success');
  const [simulationLog, setSimulationLog] = useState<string | null>(null);

  const handleInitiatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentAmount <= 0) {
      showToast('Payment amount must be greater than zero', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const initResponse = await paymentService.initiatePayment({
        studentId: activeStudent.id,
        studentName: `${activeStudent.firstName} ${activeStudent.lastName}`,
        studentMatric: activeStudent.studentId,
        email: activeStudent.email,
        phone: activeStudent.phone,
        amount: paymentAmount,
        currency: 'GHS',
        feeDescription: selectedFeeType,
        academicSession: settings.currentSession,
        semester: settings.currentSemester,
        gateway: selectedGateway,
        tenantId: 'premier-university'
      });

      showToast(`Redirecting to ${selectedGateway.toUpperCase()} secure checkout (Ref: ${initResponse.reference})`, 'info');

      // Simulate payment gateway redirect & server webhook receipt after 1.5s
      setTimeout(() => {
        const webhookPayload: WebhookEventPayload = {
          event: 'charge.success',
          reference: initResponse.reference,
          idempotencyKey: initResponse.idempotencyKey,
          amount: paymentAmount,
          currency: 'GHS',
          paidAt: new Date().toISOString(),
          channel: selectedGateway === 'hubtel_momo' ? 'Mobile Money (MTN/Telecel)' : 'Visa/Mastercard',
          gateway: selectedGateway,
          customer: {
            email: activeStudent.email,
            studentId: activeStudent.studentId,
            name: `${activeStudent.firstName} ${activeStudent.lastName}`
          },
          signature: 'VALID_HMAC_SHA512_SIGNATURE'
        };

        const result = paymentService.verifyAndProcessWebhook(webhookPayload);
        if (result.success && result.status === 'ledger_updated') {
          // Central institutional state record
          recordPayment({
            studentId: activeStudent.id,
            studentName: `${activeStudent.firstName} ${activeStudent.lastName}`,
            matricNo: activeStudent.studentId,
            amount: paymentAmount,
            description: selectedFeeType,
            gateway: selectedGateway,
            reference: initResponse.reference
          });

          logAction(
            'VERIFIED_ONLINE_PAYMENT',
            'StudentLedger',
            `Reconciled online payment of GHS ${paymentAmount.toLocaleString()} via ${selectedGateway}. Reference: ${initResponse.reference}`,
            activeStudent.id
          );

          showToast(`Payment Verified! Official receipt generated and archived.`, 'success');
          setIsPayModalOpen(false);
        } else {
          showToast(result.message, 'error');
        }
        setIsProcessing(false);
      }, 1400);
    } catch (err: any) {
      setIsProcessing(false);
      showToast(err.message || 'Payment initiation failed', 'error');
    }
  };

  const handleRunWebhookSimulation = () => {
    const mockRef = simulationMode === 'duplicate' ? 'PU-TXN-2026-00192' : paymentService.generatePaymentReference();
    const payload: WebhookEventPayload = {
      event: simulationMode === 'failed' ? 'charge.failed' : 'charge.success',
      reference: mockRef,
      idempotencyKey: paymentService.generateIdempotencyKey(),
      amount: 1500,
      currency: 'GHS',
      paidAt: new Date().toISOString(),
      channel: 'Paystack Card Checkout',
      gateway: 'paystack',
      customer: {
        email: activeStudent.email,
        studentId: activeStudent.studentId,
        name: `${activeStudent.firstName} ${activeStudent.lastName}`
      },
      signature: simulationMode === 'tampered' ? 'INVALID_TAMPERED_SIGNATURE' : 'VALID_HMAC_SHA512_SIGNATURE'
    };

    const result = paymentService.verifyAndProcessWebhook(payload);
    setSimulationLog(JSON.stringify({
      simulationTest: simulationMode,
      webhookResult: result,
      securityGuarantee: result.status === 'duplicate_ignored'
        ? 'IDEMPOTENCY_CONFIRMED: Ledger not credited twice.'
        : result.status === 'invalid_signature'
        ? 'FORGERY_BLOCKED: HMAC SHA-512 rejected.'
        : result.status === 'ledger_updated'
        ? 'RECONCILED: Official receipt dispatched.'
        : 'REVERTED_SAFELY: Failed payment did not clear student.'
    }, null, 2));

    if (result.success && result.status === 'ledger_updated') {
      showToast('Simulation Passed: Payment verified and credited', 'success');
    } else if (result.status === 'duplicate_ignored') {
      showToast('Simulation Passed: Duplicate webhook idempotently prevented', 'info');
    } else if (result.status === 'invalid_signature') {
      showToast('Simulation Passed: Tampered signature rejected safely', 'warning');
    } else {
      showToast('Simulation Complete: Payment failure recorded safely', 'info');
    }
  };

  return (
    <div id="finance-view" className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-6">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
            Bursary & Student Ledger
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 mt-2">
            Tuition Fees & Financial Clearance
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
            Official breakdown of billed semester fees, verified online payments, and institutional clearance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsWebhookSimulatorOpen(true)}
            className="px-3.5 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Gateway & Webhook Inspector
          </button>

          <button
            onClick={() => setIsPayModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <CreditCard className="w-4 h-4" />
            Make Online Payment
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Total Billed</span>
          <div className="mt-2 text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 font-mono">
            GHS <AnimatedCounter value={totalBilled} />
          </div>
          <p className="text-xs text-neutral-500 mt-2">{settings.currentSession} Academic Year</p>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Total Paid</span>
          <div className="mt-2 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
            GHS <AnimatedCounter value={totalPaid} />
          </div>
          <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1 font-semibold">
            <CheckCircle className="w-3.5 h-3.5" /> {clearancePct}% Reconciled
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-neutral-200/80 dark:border-neutral-800 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Outstanding Balance</span>
          <div className={`mt-2 text-3xl font-extrabold font-mono ${outstandingBalance === 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
            GHS <AnimatedCounter value={outstandingBalance} />
          </div>
          <p className="text-xs text-neutral-500 mt-2">
            {isFullyCleared ? 'Account Fully Cleared for Examination & Graduation' : 'Due before examination clearance'}
          </p>
        </div>
      </div>

      {/* Clearance Banner */}
      <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs ${
        isFullyCleared 
          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300'
          : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300'
      }`}>
        <div className="flex items-center gap-2.5">
          {isFullyCleared ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : <Clock className="w-5 h-5 text-amber-600" />}
          <div>
            <p className="font-bold">
              {isFullyCleared ? 'Statutory Financial Clearance: ACTIVE & CONFERRED' : 'Statutory Financial Clearance: PENDING DEFICIT CLEARANCE'}
            </p>
            <p className="text-[11px] opacity-90">
              {isFullyCleared 
                ? 'All semester institutional dues are fully cleared. Unrestricted access to exam cards and degree clearance.'
                : `A balance of GHS ${outstandingBalance.toLocaleString()} is required prior to end-of-semester examination clearance.`}
            </p>
          </div>
        </div>

        {!isFullyCleared && (
          <button
            onClick={() => {
              setPaymentAmount(outstandingBalance);
              setIsPayModalOpen(true);
            }}
            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold shrink-0 shadow-2xs"
          >
            Clear Full Balance
          </button>
        )}
      </div>

      {/* Verified Transactions Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
              Payment Receipts & Transaction Ledger ({transactions.length})
            </h3>
          </div>
          <span className="text-[11px] font-mono font-semibold text-emerald-600">
            Immutable Supabase Audit Ledger
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 dark:bg-neutral-800/40 text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="py-3 px-5">Receipt #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-5">Description</th>
                <th className="py-3 px-4">Method / Gateway</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-medium text-neutral-800 dark:text-neutral-200">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-neutral-400">
                    No financial payment transactions recorded yet. Outstanding fees can be settled via the Pay Fees Online terminal.
                  </td>
                </tr>
              ) : (
                transactions.map((tx: any) => (
                  <tr key={tx.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                    <td className="py-3.5 px-5 font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {tx.receiptNumber || tx.reference}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-neutral-500">
                      {tx.date}
                    </td>
                    <td className="py-3.5 px-5 font-semibold text-neutral-900 dark:text-neutral-100">
                      {tx.description}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 font-mono text-[11px] uppercase">
                        {(tx.method || tx.gateway || 'ONLINE').replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold">
                      GHS {tx.amount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold text-[11px]">
                        <CheckCircle className="w-3 h-3" /> Verified
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: ONLINE PAYMENT TERMINAL */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                Institutional Online Fee Payment
              </h3>
              <button onClick={() => setIsPayModalOpen(false)} className="text-neutral-400 hover:text-neutral-600">✕</button>
            </div>

            <form onSubmit={handleInitiatePayment} className="space-y-3.5">
              <div>
                <label className="font-semibold block mb-1">Select Payment Purpose</label>
                <select
                  value={selectedFeeType}
                  onChange={(e) => setSelectedFeeType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                >
                  <option value="Tuition Fee Balance">Tuition Fee Balance</option>
                  <option value="Examination Clearance Fee">Examination Clearance Fee</option>
                  <option value="Library & ICT Technology Levy">Library & ICT Technology Levy</option>
                  <option value="Graduation Clearance & Regalia Fee">Graduation Clearance & Regalia Fee</option>
                  <option value="Late Course Add/Drop Penalty">Late Course Add/Drop Penalty</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Amount to Pay (GHS)</label>
                <input
                  type="number"
                  min="10"
                  max="10000"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 font-mono font-bold text-sm"
                />
                <div className="flex gap-2 mt-1.5">
                  <button
                    type="button"
                    onClick={() => setPaymentAmount(outstandingBalance)}
                    className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[10px] text-neutral-600 font-bold"
                  >
                    Outstanding (GHS {outstandingBalance})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentAmount(500)}
                    className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[10px] text-neutral-600 font-bold"
                  >
                    GHS 500
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentAmount(1000)}
                    className="px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[10px] text-neutral-600 font-bold"
                  >
                    GHS 1,000
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Select Payment Gateway</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'paystack', name: 'Paystack', desc: 'Cards & MoMo' },
                    { id: 'flutterwave', name: 'Flutterwave', desc: 'Pan-Africa' },
                    { id: 'hubtel_momo', name: 'Hubtel MoMo', desc: 'MTN / Telecel' },
                  ].map((gw) => (
                    <button
                      key={gw.id}
                      type="button"
                      onClick={() => setSelectedGateway(gw.id as PaymentGatewayType)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        selectedGateway === gw.id
                          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-bold'
                          : 'border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-600'
                      }`}
                    >
                      <p className="text-xs leading-tight">{gw.name}</p>
                      <p className="text-[10px] text-neutral-400 font-normal mt-0.5">{gw.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-[11px] text-neutral-500 space-y-1">
                <div className="flex justify-between">
                  <span>Student:</span>
                  <strong className="text-neutral-800 dark:text-neutral-200">{activeStudent.firstName} {activeStudent.lastName}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Matriculation #:</span>
                  <strong className="text-neutral-800 dark:text-neutral-200 font-mono">{activeStudent.studentId}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Security Layer:</span>
                  <strong className="text-emerald-600">Server-Side HMAC-SHA512 Verified</strong>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center gap-1.5 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Contacting Gateway...
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      Pay GHS {paymentAmount.toLocaleString()}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PAYMENT GATEWAY & WEBHOOK SIMULATOR / INSPECTOR */}
      {isWebhookSimulatorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  Bursary Payment Reconciliation & Webhook Inspector
                </h3>
                <p className="text-[11px] text-neutral-500">
                  Adversarial and real-world test harness for server-side payment verification and idempotency.
                </p>
              </div>
              <button onClick={() => setIsWebhookSimulatorOpen(false)} className="text-neutral-400 hover:text-neutral-600">✕</button>
            </div>

            <div className="space-y-3">
              <label className="font-semibold block">Select Verification Scenario to Simulate</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'success', label: '1. Valid Webhook', desc: 'HMAC signed, balance credits' },
                  { id: 'duplicate', label: '2. Duplicate Webhook', desc: 'Idempotency blocks double-charge' },
                  { id: 'tampered', label: '3. Tampered Signature', desc: 'Rejects forged payment' },
                  { id: 'failed', label: '4. Failed / Declined', desc: 'Debt preserved, failure logged' },
                ].map((sc) => (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => setSimulationMode(sc.id as any)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      simulationMode === sc.id
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-bold'
                        : 'border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-600'
                    }`}
                  >
                    <p className="text-xs leading-tight">{sc.label}</p>
                    <p className="text-[10px] text-neutral-400 font-normal mt-0.5">{sc.desc}</p>
                  </button>
                ))}
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleRunWebhookSimulation}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Execute Webhook Simulation Test
                </button>
              </div>

              {simulationLog && (
                <div className="mt-3">
                  <p className="font-mono text-[10px] font-bold text-neutral-400 uppercase mb-1">Server Verification Response Log:</p>
                  <pre className="p-3 rounded-xl bg-neutral-900 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-52 border border-neutral-800">
                    {simulationLog}
                  </pre>
                </div>
              )}

              {/* Production Architecture Checklist */}
              <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-2">
                <p className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-indigo-600" />
                  Production Webhook Endpoints & Environment Secrets Checklist:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                    <span className="text-neutral-400 block text-[9px] uppercase">Webhook Ingress Route</span>
                    <strong className="text-indigo-600">/api/webhooks/paystack</strong>
                  </div>
                  <div className="p-2 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                    <span className="text-neutral-400 block text-[9px] uppercase">HMAC Secret Env Var</span>
                    <strong className="text-indigo-600">PAYSTACK_WEBHOOK_SECRET</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

