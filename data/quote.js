// Instant estimate tool settings. Every price here is a low/high installed range.
// THESE ARE STARTING BALLPARKS, NOT SHEA'S PRICES: have the owner confirm or
// change each number before the site goes live on his domain.
// Edit a number, commit, and the tool updates on the next deploy.
module.exports = {
  disclaimer: 'This is a ballpark range, not a quote. Your price depends on the site, access, materials and what we find once we look at it. We confirm everything in writing after a free site visit.',
  // Applied to every project type.
  access: [
    { id: 'easy', label: 'Easy: equipment can drive right to it', factor: 1 },
    { id: 'tight', label: 'Tight: narrow gate, slope or backyard only', factor: 1.15 },
    { id: 'hard', label: 'Difficult: hand work or long carry', factor: 1.3 }
  ],
  projects: [
    {
      id: 'patio', service: 'Hardscaping & Masonry', name: 'Patio', blurb: 'Paver or natural stone patio',
      unit: 'sq ft', sizeLabel: 'Patio size', min: 80, max: 2000, step: 10, start: 300,
      hint: 'A 12 x 16 ft patio is about 190 sq ft. A 15 x 20 ft patio is 300 sq ft.',
      options: { label: 'Material', choices: [
        { id: 'pavers', label: 'Concrete pavers', low: 22, high: 35 },
        { id: 'bluestone', label: 'Bluestone or natural stone', low: 35, high: 55 }
      ] },
      minimum: 3500
    },
    {
      id: 'walkway', service: 'Hardscaping & Masonry', name: 'Walkway', blurb: 'Front walk or garden path',
      unit: 'sq ft', sizeLabel: 'Walkway size', min: 30, max: 800, step: 5, start: 120,
      hint: 'Multiply length by width. A 4 ft wide, 30 ft long walk is 120 sq ft.',
      options: { label: 'Material', choices: [
        { id: 'pavers', label: 'Concrete pavers', low: 25, high: 40 },
        { id: 'bluestone', label: 'Bluestone or natural stone', low: 38, high: 60 }
      ] },
      minimum: 2000
    },
    {
      id: 'wall', service: 'Hardscaping & Masonry', name: 'Retaining wall', blurb: 'Block or natural stone wall',
      unit: 'sq ft of wall face', sizeLabel: 'Wall face (length x height)', min: 20, max: 1200, step: 10, start: 120,
      hint: 'A wall 40 ft long and 3 ft high has 120 sq ft of face.',
      options: { label: 'Material', choices: [
        { id: 'block', label: 'Segmental block', low: 55, high: 90 },
        { id: 'stone', label: 'Natural fieldstone or granite', low: 80, high: 130 }
      ] },
      minimum: 3000
    },
    {
      id: 'clearing', service: 'Land Clearing & Site Work', name: 'Land clearing', blurb: 'Brush, trees and stumps removed',
      unit: 'acres', sizeLabel: 'Area to clear', min: 0.1, max: 5, step: 0.05, start: 0.5,
      hint: 'A quarter acre is about 11,000 sq ft, roughly 100 x 110 ft.',
      options: { label: 'What is growing there', choices: [
        { id: 'brush', label: 'Brush, briars and saplings', low: 3500, high: 6500 },
        { id: 'wooded', label: 'Wooded: trees with brush underneath', low: 8000, high: 15000 },
        { id: 'heavy', label: 'Heavily wooded, stumps removed', low: 15000, high: 25000 }
      ] },
      minimum: 1500
    },
    {
      id: 'lawn', service: 'Landscape Installation & Care', name: 'New lawn', blurb: 'Loam, grade and seed or sod',
      unit: 'sq ft', sizeLabel: 'Lawn area', min: 500, max: 40000, step: 100, start: 3000,
      hint: 'A 50 x 60 ft yard is 3,000 sq ft.',
      options: { label: 'Type', choices: [
        { id: 'seed', label: 'Loam and seed or hydroseed', low: 1.25, high: 2.5 },
        { id: 'sod', label: 'Loam and sod', low: 2.5, high: 4.5 }
      ] },
      minimum: 1800
    },
    {
      id: 'tree', service: 'Tree Work', name: 'Tree removal', blurb: 'Take down, clean up, optional stump grinding',
      unit: 'trees', sizeLabel: 'Number of trees', min: 1, max: 20, step: 1, start: 1,
      hint: 'Pick the size that matches most of the trees. Mixed sizes are priced at the visit.',
      options: { label: 'Tree size', choices: [
        { id: 'small', label: 'Small: under 30 ft', low: 400, high: 900 },
        { id: 'medium', label: 'Medium: 30 to 60 ft', low: 900, high: 1800 },
        { id: 'large', label: 'Large: over 60 ft', low: 1800, high: 3500 }
      ] },
      addon: { id: 'stump', label: 'Grind the stumps too', low: 150, high: 400 },
      minimum: 400
    }
  ]
};
