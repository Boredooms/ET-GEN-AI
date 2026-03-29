"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, AlertCircle, Info } from "lucide-react";
import Link from "next/link";
import { useUserProfile } from "@/hooks/use-user-profile";

export default function FinancialProfileSetupPage() {
  const router = useRouter();
  const { profile } = useUserProfile();
  const upsertProfile = useMutation(api.financialProfiles.upsertFinancialProfile);
  
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get user role for customization
  const userRole = profile?.userType || "general";
  
  const [formData, setFormData] = useState({
    monthlyIncome: "",
    monthlyExpenses: "",
    totalAssets: "",
    totalLiabilities: "",
    portfolioValue: "",
    incomeSource: [],
    investmentTypes: [],
    hasHealthInsurance: false,
    hasLifeInsurance: false,
    hasVehicleInsurance: false,
    hasHomeLoan: false,
    hasPersonalLoan: false,
    hasCarLoan: false,
    hasCreditCard: false,
    creditCardCount: 0,
    creditScore: "",
    goals: [] as Array<{ type: string; targetAmount: number; timeHorizon: number; priority: string; currentProgress: number }>,
  });

  const [newGoal, setNewGoal] = useState({
    type: "",
    targetAmount: "",
    timeHorizon: "",
    priority: "medium",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as any;
    
    if (type === "checkbox") {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddGoal = () => {
    if (!newGoal.type || !newGoal.targetAmount || !newGoal.timeHorizon) {
      setError("Please fill all goal fields");
      return;
    }

    const goal = {
      type: newGoal.type,
      targetAmount: parseFloat(newGoal.targetAmount),
      timeHorizon: parseInt(newGoal.timeHorizon),
      priority: newGoal.priority,
      currentProgress: 0,
    };

    setFormData(prev => ({
      ...prev,
      goals: [...prev.goals, goal]
    }));

    setNewGoal({ type: "", targetAmount: "", timeHorizon: "", priority: "medium" });
    setError(null);
  };

  const handleRemoveGoal = (index: number) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const deviceId = typeof window !== "undefined" ? localStorage.getItem("deviceId") : null;
      
      if (!deviceId) {
        setError("Device ID not found. Please refresh the page.");
        setIsLoading(false);
        return;
      }

      // Validate required fields
      if (!formData.monthlyIncome || !formData.monthlyExpenses) {
        setError("Monthly income and expenses are required");
        setIsLoading(false);
        return;
      }

      await upsertProfile({
        deviceId,
        data: {
          monthlyIncome: parseFloat(formData.monthlyIncome),
          monthlyExpenses: parseFloat(formData.monthlyExpenses),
          portfolioValue: parseFloat(formData.portfolioValue) || 0,
          totalDebt: parseFloat(formData.totalLiabilities) || 0,
          incomeSource: formData.incomeSource,
          investmentTypes: formData.investmentTypes,
          hasInvestments: (formData.investmentTypes?.length || 0) > 0,
          hasHealthInsurance: formData.hasHealthInsurance,
          hasLifeInsurance: formData.hasLifeInsurance,
          hasVehicleInsurance: formData.hasVehicleInsurance,
          hasHomeLoan: formData.hasHomeLoan,
          hasPersonalLoan: formData.hasPersonalLoan,
          hasCarLoan: formData.hasCarLoan,
          hasCreditCard: formData.hasCreditCard,
          creditCardCount: parseInt(formData.creditCardCount.toString()) || 0,
          creditScore: formData.creditScore ? parseInt(formData.creditScore) : undefined,
          goals: formData.goals,
        },
      });

      // Set onboarding complete cookie
      document.cookie = "onboarding_complete=true; path=/; max-age=31536000"; // 1 year

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[oklch(0.07_0_0)] p-4 sm:p-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-editorial text-4xl text-foreground mb-2">Build Your Financial Profile</h1>
          <p className="text-muted-foreground">
            {userRole === "student" && "Share your financial details to start your financial journey with confidence."}
            {userRole === "investor" && "Share your portfolio details to get personalized investment insights."}
            {userRole === "founder" && "Share your business finances to unlock growth opportunities."}
            {userRole === "professional" && "Share your financial details for wealth management guidance."}
            {userRole === "general" && "Share your financial details to get personalized recommendations."}
          </p>
          {userRole === "student" && (
            <div className="mt-4 flex items-start gap-2 rounded-lg bg-blue-500/10 border border-blue-500/20 p-3">
              <Info className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-300">
                Don't worry if you don't have all the answers. You can skip optional fields and update them later.
              </p>
            </div>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="mb-8 flex gap-2">
          {[1, 2, 3].map((s) => (
            <button
              key={s}
              onClick={() => setStep(s)}
              className={`h-2 flex-1 rounded-full transition-all ${
                s <= step
                  ? "bg-foreground"
                  : "bg-[oklch(0.15_0_0)]"
              }`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Income & Expenses */}
          {step === 1 && (
            <div className="space-y-6 rounded-2xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0_0)] p-6">
              <h2 className="text-xl font-semibold text-foreground">
                {userRole === "student" ? "Income & Budget" : "Income & Expenses"}
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {userRole === "student" ? "Monthly Income / Allowance (₹)" : "Monthly Income (₹)"}
                  </label>
                  <input
                    type="number"
                    name="monthlyIncome"
                    value={formData.monthlyIncome}
                    onChange={handleInputChange}
                    placeholder={userRole === "student" ? "10000" : "50000"}
                    className="w-full rounded-lg border border-[oklch(1_0_0_/_10%)] bg-[oklch(0.12_0_0)] px-4 py-2 text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
                    required
                  />
                  {userRole === "student" && (
                    <p className="mt-1 text-xs text-muted-foreground">Include pocket money, part-time job, or stipend</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Monthly Expenses (₹)
                  </label>
                  <input
                    type="number"
                    name="monthlyExpenses"
                    value={formData.monthlyExpenses}
                    onChange={handleInputChange}
                    placeholder={userRole === "student" ? "8000" : "30000"}
                    className="w-full rounded-lg border border-[oklch(1_0_0_/_10%)] bg-[oklch(0.12_0_0)] px-4 py-2 text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
                    required
                  />
                  {userRole === "student" && (
                    <p className="mt-1 text-xs text-muted-foreground">Include food, transport, books, and entertainment</p>
                  )}
                </div>

                {userRole !== "student" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {userRole === "founder" ? "Business Assets (₹)" : "Total Assets (₹)"}
                      </label>
                      <input
                        type="number"
                        name="totalAssets"
                        value={formData.totalAssets}
                        onChange={handleInputChange}
                        placeholder="500000"
                        className="w-full rounded-lg border border-[oklch(1_0_0_/_10%)] bg-[oklch(0.12_0_0)] px-4 py-2 text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
                      />
                      {userRole === "founder" && (
                        <p className="mt-1 text-xs text-muted-foreground">Include equipment, inventory, cash reserves</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {userRole === "founder" ? "Business Liabilities (₹)" : "Total Liabilities (₹)"}
                      </label>
                      <input
                        type="number"
                        name="totalLiabilities"
                        value={formData.totalLiabilities}
                        onChange={handleInputChange}
                        placeholder="100000"
                        className="w-full rounded-lg border border-[oklch(1_0_0_/_10%)] bg-[oklch(0.12_0_0)] px-4 py-2 text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
                      />
                    </div>
                  </>
                )}

                {(userRole === "investor" || userRole === "professional") && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Portfolio Value (₹)
                    </label>
                    <input
                      type="number"
                      name="portfolioValue"
                      value={formData.portfolioValue}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full rounded-lg border border-[oklch(1_0_0_/_10%)] bg-[oklch(0.12_0_0)] px-4 py-2 text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">Total value of investments (stocks, mutual funds, etc.)</p>
                  </div>
                )}

                {userRole === "student" && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Savings (₹) <span className="text-muted-foreground font-normal">(Optional)</span>
                    </label>
                    <input
                      type="number"
                      name="portfolioValue"
                      value={formData.portfolioValue}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="w-full rounded-lg border border-[oklch(1_0_0_/_10%)] bg-[oklch(0.12_0_0)] px-4 py-2 text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
                    />
                    <p className="mt-1 text-xs text-muted-foreground">Money saved in bank or emergency fund</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Credit Score <span className="text-muted-foreground font-normal">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    name="creditScore"
                    value={formData.creditScore}
                    onChange={handleInputChange}
                    placeholder="750"
                    className="w-full rounded-lg border border-[oklch(1_0_0_/_10%)] bg-[oklch(0.12_0_0)] px-4 py-2 text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
                  />
                  {userRole === "student" && (
                    <p className="mt-1 text-xs text-muted-foreground">Skip if you don't have a credit history yet</p>
                  )}
                </div>
              </div>

              {error && (
                <div className="flex gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3">
                  <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-3 font-semibold text-background hover:opacity-90 transition-opacity"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Step 2: Insurance & Loans */}
          {step === 2 && (
            <div className="space-y-6 rounded-2xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0_0)] p-6">
              <h2 className="text-xl font-semibold text-foreground">
                {userRole === "student" ? "Financial Protection (Optional)" : "Insurance & Loans"}
              </h2>

              {userRole === "student" && (
                <div className="flex items-start gap-2 rounded-lg bg-blue-500/10 border border-blue-500/20 p-3">
                  <Info className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-300">
                    These are optional for students. Focus on building your emergency fund first!
                  </p>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="font-medium text-foreground">
                  {userRole === "student" ? "Insurance (If Any)" : "Insurance Coverage"}
                </h3>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="hasHealthInsurance"
                    checked={formData.hasHealthInsurance}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-foreground">Health Insurance</span>
                </label>
                {userRole !== "student" && (
                  <>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="hasLifeInsurance"
                        checked={formData.hasLifeInsurance}
                        onChange={handleInputChange}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-sm text-foreground">Life Insurance</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="hasVehicleInsurance"
                        checked={formData.hasVehicleInsurance}
                        onChange={handleInputChange}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-sm text-foreground">Vehicle Insurance</span>
                    </label>
                  </>
                )}
              </div>

              {userRole !== "student" && (
                <div className="space-y-4">
                  <h3 className="font-medium text-foreground">
                    {userRole === "founder" ? "Business Loans" : "Active Loans"}
                  </h3>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="hasHomeLoan"
                      checked={formData.hasHomeLoan}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-foreground">
                      {userRole === "founder" ? "Business Loan" : "Home Loan"}
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="hasPersonalLoan"
                      checked={formData.hasPersonalLoan}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-foreground">Personal Loan</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="hasCarLoan"
                      checked={formData.hasCarLoan}
                      onChange={handleInputChange}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-foreground">
                      {userRole === "founder" ? "Equipment Loan" : "Car Loan"}
                    </span>
                  </label>
                </div>
              )}

              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="hasCreditCard"
                    checked={formData.hasCreditCard}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-foreground">Have Credit Card(s)</span>
                </label>
                {formData.hasCreditCard && (
                  <input
                    type="number"
                    name="creditCardCount"
                    value={formData.creditCardCount}
                    onChange={handleInputChange}
                    placeholder="1"
                    className="w-full rounded-lg border border-[oklch(1_0_0_/_10%)] bg-[oklch(0.12_0_0)] px-4 py-2 text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
                  />
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 rounded-lg border border-[oklch(1_0_0_/_10%)] px-4 py-3 font-medium text-foreground hover:bg-[oklch(0.12_0_0)] transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-3 font-semibold text-background hover:opacity-90 transition-opacity"
                >
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Goals */}
          {step === 3 && (
            <div className="space-y-6 rounded-2xl border border-[oklch(1_0_0_/_8%)] bg-[oklch(0.09_0_0)] p-6">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Financial Goals</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {userRole === "student" && "What do you want to achieve? Start with small, achievable goals."}
                  {userRole === "investor" && "Set clear targets for your investment portfolio and returns."}
                  {userRole === "founder" && "Define your business growth and funding milestones."}
                  {userRole === "professional" && "Plan for retirement, wealth creation, and major purchases."}
                  {userRole === "general" && "What financial goals are you working towards?"}
                </p>
              </div>

              <div className="space-y-4 border-b border-[oklch(1_0_0_/_10%)] pb-6">
                <h3 className="font-medium text-foreground">Add a New Goal</h3>
                <select
                  value={newGoal.type}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full rounded-lg border border-[oklch(1_0_0_/_10%)] bg-[oklch(0.12_0_0)] px-4 py-2 text-foreground focus:border-foreground focus:outline-none"
                >
                  <option value="">Select Goal Type</option>
                  {userRole === "student" && (
                    <>
                      <option value="emergency_fund">Emergency Fund</option>
                      <option value="education">Education / Certification</option>
                      <option value="laptop">Laptop / Phone Purchase</option>
                      <option value="vacation">Vacation / Travel</option>
                      <option value="investment">Start Investing</option>
                    </>
                  )}
                  {userRole === "investor" && (
                    <>
                      <option value="portfolio_target">Portfolio Target</option>
                      <option value="retirement">Retirement Corpus</option>
                      <option value="passive_income">Passive Income Goal</option>
                      <option value="investment">New Investment Category</option>
                      <option value="home_purchase">Home Purchase</option>
                    </>
                  )}
                  {userRole === "founder" && (
                    <>
                      <option value="funding_round">Funding Round</option>
                      <option value="revenue_target">Revenue Target</option>
                      <option value="expansion">Business Expansion</option>
                      <option value="equipment">Equipment Purchase</option>
                      <option value="emergency_fund">Business Emergency Fund</option>
                    </>
                  )}
                  {userRole === "professional" && (
                    <>
                      <option value="retirement">Retirement Planning</option>
                      <option value="home_purchase">Home Purchase</option>
                      <option value="education">Children's Education</option>
                      <option value="vehicle">Vehicle Purchase</option>
                      <option value="investment">Investment Target</option>
                    </>
                  )}
                  {userRole === "general" && (
                    <>
                      <option value="home_purchase">Home Purchase</option>
                      <option value="education">Education</option>
                      <option value="retirement">Retirement</option>
                      <option value="emergency_fund">Emergency Fund</option>
                      <option value="vacation">Vacation</option>
                      <option value="vehicle">Vehicle Purchase</option>
                      <option value="investment">Investment Target</option>
                    </>
                  )}
                </select>

                <input
                  type="number"
                  placeholder="Target Amount (₹)"
                  value={newGoal.targetAmount}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, targetAmount: e.target.value }))}
                  className="w-full rounded-lg border border-[oklch(1_0_0_/_10%)] bg-[oklch(0.12_0_0)] px-4 py-2 text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
                />

                <input
                  type="number"
                  placeholder="Time Horizon (Years)"
                  value={newGoal.timeHorizon}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, timeHorizon: e.target.value }))}
                  className="w-full rounded-lg border border-[oklch(1_0_0_/_10%)] bg-[oklch(0.12_0_0)] px-4 py-2 text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
                />

                <select
                  value={newGoal.priority}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full rounded-lg border border-[oklch(1_0_0_/_10%)] bg-[oklch(0.12_0_0)] px-4 py-2 text-foreground focus:border-foreground focus:outline-none"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>

                <button
                  type="button"
                  onClick={handleAddGoal}
                  className="w-full rounded-lg border border-[oklch(1_0_0_/_10%)] px-4 py-2 font-medium text-foreground hover:bg-[oklch(0.12_0_0)] transition-colors"
                >
                  + Add Goal
                </button>
              </div>

              {/* Added Goals */}
              {formData.goals.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium text-foreground">Your Goals</h3>
                  {formData.goals.map((goal, idx) => (
                    <div key={idx} className="flex items-start justify-between rounded-lg border border-[oklch(1_0_0_/_10%)] bg-[oklch(0.12_0_0)] p-4">
                      <div>
                        <p className="font-medium text-foreground capitalize">{goal.type.replace(/_/g, ' ')}</p>
                        <p className="text-sm text-muted-foreground">
                          ₹{(goal.targetAmount / 100000).toFixed(1)}L in {goal.timeHorizon} year(s) • {goal.priority}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveGoal(idx)}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {formData.goals.length === 0 && userRole === "student" && (
                <div className="flex items-start gap-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-3">
                  <Info className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-yellow-300">
                    It's okay to skip goals for now. You can add them later from your dashboard!
                  </p>
                </div>
              )}

              {error && (
                <div className="flex gap-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3">
                  <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 rounded-lg border border-[oklch(1_0_0_/_10%)] px-4 py-3 font-medium text-foreground hover:bg-[oklch(0.12_0_0)] transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-foreground px-4 py-3 font-semibold text-background hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Complete Setup <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
