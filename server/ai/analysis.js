const keywordToCategory = {
  food: 'Food & Nutrition',
  meal: 'Food & Nutrition',
  milk: 'Food & Nutrition',
  diaper: 'Shelter & Family Support',
  medicine: 'Medical',
  medical: 'Medical',
  nurse: 'Medical',
  clinic: 'Medical',
  shelter: 'Shelter & Family Support',
  blanket: 'Shelter & Family Support',
  hygiene: 'Shelter & Family Support',
  water: 'Water & Sanitation',
  contamination: 'Water & Sanitation',
  transport: 'Logistics',
  logistics: 'Logistics',
  warehouse: 'Logistics',
  hotline: 'Coordination',
  translation: 'Coordination',
  childcare: 'Family Care',
  counselor: 'Mental Health',
  mental: 'Mental Health',
  power: 'Infrastructure',
  electrician: 'Infrastructure'
};

const severityLexicon = ['immediate', 'immediately', 'urgent', 'overcrowded', 'isolated', 'contamination', 'evacuation'];

export function extractKeywords(text) {
  const tokens = text.toLowerCase().replace(/[^a-z\s-]/g, '').split(/\s+/).filter(Boolean);
  return [...new Set(tokens.filter((token) => Object.keys(keywordToCategory).some((key) => token.includes(key))))];
}

export function categorizeNeeds(keywords) {
  const categoryCount = {};
  keywords.forEach((word) => {
    const match = Object.entries(keywordToCategory).find(([key]) => word.includes(key));
    if (match) {
      const category = match[1];
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    }
  });
  return Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'General Support';
}

export function scoreUrgency(text, severitySignals = []) {
  const lower = text.toLowerCase();
  const severityHits = severityLexicon.reduce((count, cue) => count + (lower.includes(cue) ? 1 : 0), 0);
  const numericHits = (lower.match(/\d+/g) || []).length;
  const signalHits = severitySignals.length;
  const score = severityHits * 35 + numericHits * 15 + signalHits * 20;

  if (score >= 90) return { label: 'High', score };
  if (score >= 45) return { label: 'Medium', score };
  return { label: 'Low', score };
}

function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const availabilityWeight = {
  'full-day': 1,
  evening: 0.7,
  weekend: 0.5
};

export function matchVolunteers(request, volunteers) {
  const keywords = extractKeywords(request.text);
  return volunteers
    .map((volunteer) => {
      const skillMatches = volunteer.skills.filter((skill) => keywords.some((word) => word.includes(skill) || skill.includes(word)));
      const skillScore = Math.min(100, skillMatches.length * 40);
      const distanceKm = haversineDistance(request.lat, request.lng, volunteer.lat, volunteer.lng);
      const distanceScore = Math.max(0, 100 - distanceKm * 15);
      const availabilityScore = availabilityWeight[volunteer.availability] * 100;
      const totalScore = Math.round(skillScore * 0.5 + distanceScore * 0.3 + availabilityScore * 0.2);

      return {
        ...volunteer,
        matchScore: totalScore,
        reasoning: `Skills: ${skillMatches.length ? skillMatches.join(', ') : 'No direct skill overlap'} · Distance: ${distanceKm.toFixed(1)} km · Availability: ${volunteer.availability}`,
        explainability: {
          skillScore,
          distanceScore: Math.round(distanceScore),
          availabilityScore
        }
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);
}

export function enrichReport(report) {
  const keywords = extractKeywords(report.text);
  const category = categorizeNeeds(keywords);
  const urgency = scoreUrgency(report.text, report.severitySignals);
  return {
    ...report,
    keywords,
    category,
    urgency
  };
}
