/**
 * AI-Style Explanation Generator
 * Generates natural language explanations for financial decisions
 */

import {
    FinancialBehaviorScore,
    SubscriptionHealthScore,
    InvestmentDecision,
} from '../types/financial';

/**
 * Generate AI explanation for Financial Health Score
 */
export function generateHealthScoreExplanation(score: FinancialBehaviorScore): string {
    const { totalScore, breakdown, riskProfile } = score;

    let explanation = '';

    // Opening statement based on score
    if (totalScore >= 80) {
        explanation = `🎯 Excellent financial health! Your score of ${totalScore}/100 indicates strong financial discipline and stability. `;
    } else if (totalScore >= 60) {
        explanation = `✅ Good financial position. Your score of ${totalScore}/100 shows solid fundamentals with room for optimization. `;
    } else if (totalScore >= 40) {
        explanation = `⚠️ Fair financial health. Your score of ${totalScore}/100 suggests some areas need attention. `;
    } else {
        explanation = `🚨 Financial health needs improvement. Your score of ${totalScore}/100 indicates significant risk factors. `;
    }

    // Highlight strongest area
    const scores = [
        { name: 'spending stability', score: breakdown.spendingStability.score },
        { name: 'emergency buffer', score: breakdown.emergencyBuffer.score },
        { name: 'subscription management', score: breakdown.subscriptionBurden.score },
        { name: 'market risk tolerance', score: breakdown.marketRisk.score },
    ];
    const strongest = scores.reduce((max, curr) => curr.score > max.score ? curr : max);

    explanation += `Your strongest area is ${strongest.name} (${strongest.score}/100). `;

    // Highlight weakest area
    const weakest = scores.reduce((min, curr) => curr.score < min.score ? curr : min);
    if (weakest.score < 60) {
        explanation += `Consider improving your ${weakest.name} (${weakest.score}/100) for better overall health. `;
    }

    // Add specific insights
    if (breakdown.emergencyBuffer.monthsOfExpenses < 2) {
        explanation += `\n\n💡 Priority: Build your emergency fund to at least 2 months of expenses (currently ${breakdown.emergencyBuffer.monthsOfExpenses.toFixed(1)} months).`;
    }

    if (breakdown.spendingStability.coefficientOfVariation > 0.4) {
        explanation += `\n\n📊 Insight: Your spending varies significantly month-to-month. Creating a budget could improve stability.`;
    }

    if (breakdown.subscriptionBurden.percentageOfIncome > 15) {
        explanation += `\n\n💳 Alert: Subscriptions consume ${breakdown.subscriptionBurden.percentageOfIncome.toFixed(1)}% of your income. Review for unused services.`;
    }

    // Risk profile summary
    explanation += `\n\nInvestment Profile: ${riskProfile.charAt(0).toUpperCase() + riskProfile.slice(1)}`;

    return explanation;
}

/**
 * Generate AI explanation for Subscription Health
 */
export function generateSubscriptionExplanation(health: SubscriptionHealthScore): string {
    const { totalScore, subscriptions, totalMonthlyWaste } = health;

    let explanation = '';

    if (totalScore >= 80) {
        explanation = `✨ Healthy subscription portfolio! All your subscriptions appear to be actively used and well-managed. `;
    } else if (totalScore >= 60) {
        explanation = `👍 Decent subscription health. Most subscriptions are justified, but some optimization possible. `;
    } else if (totalScore >= 40) {
        explanation = `⚠️ Subscription leakage detected. Several subscriptions may not be providing value. `;
    } else {
        explanation = `🚨 High subscription waste! Multiple unused subscriptions are draining your finances. `;
    }

    const atRisk = subscriptions.filter(s => s.shouldCancel);

    if (atRisk.length > 0) {
        explanation += `\n\n${atRisk.length} subscription${atRisk.length > 1 ? 's' : ''} flagged for review:\n`;

        atRisk.slice(0, 3).forEach(sub => {
            explanation += `\n• ${sub.subscription.merchant} (₹${sub.subscription.amount}/month) - ${sub.reasoning}`;
        });

        if (totalMonthlyWaste > 0) {
            explanation += `\n\n💰 Potential savings: ₹${totalMonthlyWaste.toFixed(2)}/month (₹${(totalMonthlyWaste * 12).toFixed(2)}/year)`;
        }
    } else {
        explanation += `All ${subscriptions.length} subscriptions are actively used and affordable.`;
    }

    return explanation;
}

/**
 * Generate AI explanation for Investment Decision
 */
export function generateInvestmentExplanation(decision: InvestmentDecision, healthScore: number): string {
    const { shouldInvest, amount, aggression, riskLevel, aggressionMultiplier, spareChange } = decision;

    let explanation = '';

    if (!shouldInvest) {
        explanation = `🛡️ Investment paused for safety. Your current financial health (${healthScore}/100) suggests focusing on building emergency reserves before investing. `;
        explanation += `\n\nOnce your emergency fund reaches 2+ months of expenses, we'll automatically resume investments.`;
        return explanation;
    }

    // Opening based on risk level
    if (riskLevel === 'aggressive') {
        explanation = `🚀 Aggressive investment mode active! Your strong financial health (${healthScore}/100) allows for maximum investment potential. `;
    } else if (riskLevel === 'moderate') {
        explanation = `⚖️ Balanced investment approach. Your good financial position (${healthScore}/100) supports moderate investment activity. `;
    } else if (riskLevel === 'conservative') {
        explanation = `🛡️ Conservative investment mode. Given your current health score (${healthScore}/100), we're taking a cautious approach. `;
    } else {
        explanation = `🐌 Minimal investment mode. Your financial health (${healthScore}/100) requires careful, limited investing. `;
    }

    // Investment details
    const investmentRate = Math.round(aggressionMultiplier * 100);
    explanation += `\n\nCurrent transaction: Investing ₹${amount.toFixed(2)} (${investmentRate}% of ₹${spareChange.toFixed(2)} spare change)`;

    // Explain the multiplier
    if (aggressionMultiplier > 0.8) {
        explanation += `\n\n✨ Confidence boost applied! Your excellent financial discipline earned bonus investment allocation.`;
    } else if (aggressionMultiplier < 0.5) {
        explanation += `\n\n⚠️ Reduced allocation to protect your financial stability. Focus on improving health score for better returns.`;
    }

    // Future outlook
    if (healthScore < 70) {
        explanation += `\n\n📈 Growth potential: Improve your health score to unlock higher investment rates and better returns.`;
    }

    return explanation;
}

/**
 * Generate comprehensive AI summary for dashboard
 */
export function generateDashboardSummary(
    healthScore: FinancialBehaviorScore,
    subscriptionHealth: SubscriptionHealthScore,
    investment: InvestmentDecision
): string {
    let summary = '';

    // Overall status
    if (healthScore.totalScore >= 70 && subscriptionHealth.totalScore >= 70) {
        summary = `🌟 Strong financial position! Your disciplined approach is paying off. `;
    } else if (healthScore.totalScore >= 50) {
        summary = `📊 Steady progress. You're on the right track with room for optimization. `;
    } else {
        summary = `🎯 Focus mode activated. Let's work on strengthening your financial foundation. `;
    }

    // Key metric
    summary += `Health score: ${healthScore.totalScore}/100 (${healthScore.riskProfile})`;

    // Top priority
    if (healthScore.breakdown.emergencyBuffer.score < 50) {
        summary += `\n\nTop Priority: Build emergency fund to ${Math.ceil(healthScore.breakdown.emergencyBuffer.monthsOfExpenses + 1)} months of expenses.`;
    } else if (subscriptionHealth.totalMonthlyWaste > 50) {
        summary += `\n\nQuick Win: Cancel unused subscriptions to save ₹${subscriptionHealth.totalMonthlyWaste.toFixed(0)}/month.`;
    } else if (investment.shouldInvest && investment.aggressionMultiplier < 0.6) {
        summary += `\n\nOpportunity: Improve stability to unlock higher investment rates.`;
    }

    return summary;
}

/**
 * Generate trend indicator text
 */
export function generateTrendText(currentScore: number, previousScore?: number): string {
    if (!previousScore) return 'New metric';

    const diff = currentScore - previousScore;

    if (diff > 5) return `↑ Up ${diff.toFixed(0)} points`;
    if (diff < -5) return `↓ Down ${Math.abs(diff).toFixed(0)} points`;
    return '→ Stable';
}

/**
 * Generate confidence score explanation
 */
export function generateConfidenceExplanation(confidence: number): string {
    if (confidence >= 90) return 'Very high confidence - strong data pattern';
    if (confidence >= 70) return 'High confidence - reliable prediction';
    if (confidence >= 50) return 'Moderate confidence - monitor closely';
    return 'Low confidence - needs more data';
}
