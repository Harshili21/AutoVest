import { useState } from 'react';

export default function AutoVestForm() {
  const [formData, setFormData] = useState({
    daily_spending: '',
    spare_change_total: '',
    spending_variance: '',
    emergency_balance_ratio: '',
    market_risk_score: '',
    user_type: 'professional'
  });

  const [result, setResult] = useState<{ decision: string; confidence: number; reasoning: string[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setIsLoading(true);

    const payload = {
      daily_spending: parseFloat(formData.daily_spending),
      spare_change_total: parseFloat(formData.spare_change_total),
      spending_variance: parseFloat(formData.spending_variance),
      emergency_balance_ratio: parseFloat(formData.emergency_balance_ratio),
      market_risk_score: parseFloat(formData.market_risk_score),
      user_type: formData.user_type
    };

    try {
      // NOTE: Ensure this is your live Render API URL, with /predict at the end
      const response = await fetch('https://autovest-api.onrender.com/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Failed to reach the AutoVest API');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setError('Could not connect to the ML engine.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Daily Spending ($)</label>
            <input name="daily_spending" type="number" step="0.01" placeholder="e.g. 45.50" onChange={handleChange} required 
              className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Spare Change ($)</label>
            <input name="spare_change_total" type="number" step="0.01" placeholder="e.g. 2.15" onChange={handleChange} required 
              className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Spending Variance</label>
            <input name="spending_variance" type="number" step="0.1" placeholder="e.g. 0.8" onChange={handleChange} required 
              className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Emergency Fund Ratio</label>
            <input name="emergency_balance_ratio" type="number" step="0.1" placeholder="e.g. 1.5" onChange={handleChange} required 
              className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Market Risk Score</label>
            <input name="market_risk_score" type="number" step="0.1" placeholder="e.g. 0.3" onChange={handleChange} required 
              className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">User Profile</label>
            <select name="user_type" onChange={handleChange} 
              className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all">
              <option value="professional">Professional</option>
              <option value="student">Student</option>
            </select>
          </div>
        </div>

        <button type="submit" disabled={isLoading} 
          className="w-full bg-primary text-primary-foreground font-semibold py-2.5 px-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 mt-2 shadow-lg shadow-primary/20">
          {isLoading ? 'Processing via Cloud ML...' : 'Analyze Portfolio'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
          {error}
        </div>
      )}
      
      {result && (
        <div className="mt-6 p-5 rounded-xl bg-secondary border border-border shadow-inner">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
            Decision: 
            <span className={result.decision === 'Invest' ? 'text-success' : 'text-warning'}>
              {result.decision}
            </span>
          </h3>
          <div className="space-y-2 text-sm">
            <p className="flex justify-between border-b border-border/50 pb-1">
              <span className="text-muted-foreground">Confidence</span>
              <span className="font-semibold text-foreground">{(result.confidence * 100).toFixed(1)}%</span>
            </p>
            <p className="flex justify-between pt-1">
              <span className="text-muted-foreground">Driving Factors</span>
              <span className="font-semibold text-foreground text-right">{result.reasoning.join(', ')}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}