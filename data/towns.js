// All 15 Cape Cod towns. `notes` gives each service a town-specific angle so the
// service-by-town pages are not copies of each other.
const OKH = 'Parts of town north of Route 6 fall inside the Old King\'s Highway Regional Historic District, where walls, fences and other changes visible from the road can need review.';

module.exports = [
  {
    slug: 'sandwich-ma', name: 'Sandwich', area: 'Upper Cape', home: true,
    villages: ['East Sandwich', 'Sandwich Village', 'Forestdale', 'South Sandwich'],
    near: ['bourne-ma', 'mashpee-ma', 'barnstable-ma'],
    about: 'Sandwich is home base. The oldest town on the Cape runs from the marshes along Route 6A up over the wooded moraine and down to the sandy pine woods of Forestdale.',
    land: 'North of the Mid-Cape Highway the ground is glacial moraine: hilly, with boulders and heavier soil. South of it, in Forestdale, it is flat sandy outwash under pitch pine and scrub oak.',
    rules: OKH,
    notes: {
      hardscaping: 'The slopes off Route 6A and around the ridge call for retaining walls and stepped patios, and the fieldstone that comes out of the ground here suits the older homes in the village.',
      clearing: 'Wooded lots in Forestdale and South Sandwich clear quickly on sand, while moraine lots near the highway often turn up boulders that have to be dug out and moved.',
      landscaping: 'Properties near the marsh and Town Neck take salt and wind, so we lean on bayberry, grasses and hydrangeas there and save the tender plants for sheltered yards inland.',
      tree: 'Tall oaks on the ridge and pitch pines in Forestdale are the usual removals, often leaning toward a house after a wet, windy winter.'
    }
  },
  {
    slug: 'bourne-ma', name: 'Bourne', area: 'Upper Cape',
    villages: ['Buzzards Bay', 'Sagamore', 'Sagamore Beach', 'Pocasset', 'Cataumet', 'Monument Beach', 'Bournedale'],
    near: ['sandwich-ma', 'falmouth-ma'],
    about: 'Bourne sits on both sides of the Cape Cod Canal, from Sagamore Beach and Buzzards Bay on the mainland side to Pocasset and Cataumet along Buzzards Bay.',
    land: 'Much of Bourne is rolling moraine with rocky soil, and the Buzzards Bay shoreline is cut with coves, necks and steep banks.',
    rules: 'Shorefront lots in Pocasset, Cataumet and Monument Beach often sit inside Conservation Commission jurisdiction.',
    notes: {
      hardscaping: 'Sloped waterfront lots in Pocasset and Cataumet are natural places for stone steps, terraced walls and patios that step down toward the water.',
      clearing: 'Rocky moraine soil means stumps and boulders come out together, so we plan Bourne clearing jobs with the right machine for the digging.',
      landscaping: 'Southwest wind off Buzzards Bay is steady all summer, and plantings on the bay side need to be chosen to take it.',
      tree: 'Exposed trees along the canal and the bay shore take the brunt of storms, and wind-thrown oak and pine are common here.'
    }
  },
  {
    slug: 'falmouth-ma', name: 'Falmouth', area: 'Upper Cape',
    villages: ['Woods Hole', 'East Falmouth', 'North Falmouth', 'West Falmouth', 'Waquoit', 'Teaticket', 'Hatchville', 'Falmouth Heights'],
    near: ['bourne-ma', 'mashpee-ma'],
    about: 'Falmouth is the second largest town on the Cape, with a rocky Buzzards Bay side, a long Vineyard Sound shoreline and a string of salt ponds and necks through East Falmouth.',
    land: 'West and North Falmouth and Woods Hole sit on bouldery moraine. East Falmouth and Waquoit are flatter sandy outwash split by long, narrow coastal ponds.',
    rules: 'With so many ponds and so much shoreline, a large share of Falmouth lots have a wetland or coastal buffer somewhere on them.',
    notes: {
      hardscaping: 'West Falmouth and Woods Hole are stone wall country, and granite and fieldstone work fits the older properties there better than anything manufactured.',
      clearing: 'The necks in East Falmouth have a lot of overgrown back lots running down to the ponds, where clearing has to stop at the buffer line.',
      landscaping: 'Sandy East Falmouth soil needs loam and compost worked in before a lawn or bed will hold water through July.',
      tree: 'Big old oaks around West Falmouth and pines along the ponds are the common jobs, along with view pruning where the town allows it.'
    }
  },
  {
    slug: 'mashpee-ma', name: 'Mashpee', area: 'Upper Cape',
    villages: ['New Seabury', 'Popponesset', 'South Mashpee', 'Mashpee Neck', 'Willowbend'],
    near: ['sandwich-ma', 'falmouth-ma', 'barnstable-ma'],
    about: 'Mashpee runs from the big freshwater ponds in the north down to New Seabury and Popponesset on Nantucket Sound, with a lot of conservation land in between.',
    land: 'Mashpee is almost all sandy outwash plain under pitch pine and scrub oak, with large ponds and the Mashpee and Quashnet rivers running through it.',
    rules: 'Many neighborhoods here are planned communities with their own landscape and design rules on top of the town\'s.',
    notes: {
      hardscaping: 'Paver patios, pool surrounds and front walks are the steady work in New Seabury and the newer neighborhoods, and association guidelines often shape material choices.',
      clearing: 'Dense pine and oak lots clear cleanly on Mashpee sand, and the open ground usually needs loam brought in before it will grow a lawn.',
      landscaping: 'Many Mashpee homes are second homes, so we plan plantings that hold up between visits and keep maintenance simple.',
      tree: 'Pitch pines planted tight to houses decades ago are now tall, top-heavy and the most common removal in town.'
    }
  },
  {
    slug: 'barnstable-ma', name: 'Barnstable', area: 'Mid Cape',
    villages: ['Hyannis', 'Centerville', 'Osterville', 'Cotuit', 'Marstons Mills', 'West Barnstable', 'Barnstable Village'],
    near: ['sandwich-ma', 'mashpee-ma', 'yarmouth-ma'],
    about: 'Barnstable is the largest town on the Cape, made up of seven villages that stretch from Sandy Neck and the Great Marshes on the bay to Osterville and Cotuit on the sound.',
    land: 'The north side along Route 6A is hilly moraine with stone walls and heavier soil. The south side villages sit on sandy outwash that runs down to bays and harbors.',
    rules: OKH,
    notes: {
      hardscaping: 'Osterville and Cotuit estates call for bluestone and granite, while Centerville and Marstons Mills see more paver patios and walkways. We build both.',
      clearing: 'Marstons Mills and West Barnstable still have large wooded parcels, and clearing for new homes and additions is common there.',
      landscaping: 'From wind-swept lots near Craigville and Long Beach to sheltered yards in Marstons Mills, plant choice changes a lot inside one town.',
      tree: 'Mature oaks on the 6A side and tall pines through Centerville and Hyannis keep tree removal and storm cleanup steady here.'
    }
  },
  {
    slug: 'yarmouth-ma', name: 'Yarmouth', area: 'Mid Cape',
    villages: ['South Yarmouth', 'West Yarmouth', 'Yarmouth Port', 'Bass River'],
    near: ['barnstable-ma', 'dennis-ma'],
    about: 'Yarmouth reaches from the captains\' houses of Yarmouth Port on the bay side to the busy neighborhoods of South and West Yarmouth along Nantucket Sound and Bass River.',
    land: 'A band of moraine runs across the north of town, and the south is level sandy outwash with smaller, closer-set lots.',
    rules: OKH,
    notes: {
      hardscaping: 'Smaller lots in South and West Yarmouth get the most from a well-planned patio and walk, where every square foot has to earn its place.',
      clearing: 'Most Yarmouth clearing is taking back overgrown edges and rear yards on built lots, along with site prep for additions and new septic systems.',
      landscaping: 'Cottage and rental properties near the sound beaches need tidy, low-water plantings that look good from May to October.',
      tree: 'Pines and oaks crowd close to houses in the older subdivisions, and removals here are usually tight jobs that have to be taken down in pieces.'
    }
  },
  {
    slug: 'dennis-ma', name: 'Dennis', area: 'Mid Cape',
    villages: ['Dennis Village', 'East Dennis', 'South Dennis', 'West Dennis', 'Dennis Port'],
    near: ['yarmouth-ma', 'brewster-ma', 'harwich-ma'],
    about: 'Dennis crosses the Cape from the bay beaches and Scargo Hill in the north to West Dennis and Dennis Port on the sound, with Bass River along its western edge.',
    land: 'The north side around Scargo Hill is some of the hilliest ground on the Mid Cape. The south side is flat, sandy and close to sea level near the beaches.',
    rules: OKH,
    notes: {
      hardscaping: 'Hillside lots around Scargo Lake and East Dennis need walls and steps to make the grade usable, and low-lying yards in Dennis Port need careful pitch for drainage.',
      clearing: 'Brush and vine overgrowth on the north side and lot prep for rebuilds near the south side beaches make up most of the clearing work here.',
      landscaping: 'Salt spray reaches well back from West Dennis and Dennis Port beaches, so tough coastal plants do the heavy lifting on the south side.',
      tree: 'Storm-damaged pines on the south side and large hardwoods around Dennis Village are the regular calls.'
    }
  },
  {
    slug: 'harwich-ma', name: 'Harwich', area: 'Lower Cape',
    villages: ['Harwich Port', 'Harwich Center', 'West Harwich', 'East Harwich', 'North Harwich', 'South Harwich', 'Pleasant Lake'],
    near: ['dennis-ma', 'brewster-ma', 'chatham-ma'],
    about: 'Harwich is seven villages around a quiet center, with harbors on Nantucket Sound, cranberry bogs inland and big ponds up toward Pleasant Lake.',
    land: 'Harwich is mostly sandy outwash plain dotted with kettle ponds and old cranberry bogs, which means wetlands turn up on a lot of properties.',
    rules: 'Bogs, ponds and the herring river put many Harwich lots within reach of a wetland buffer.',
    notes: {
      hardscaping: 'Harwich Port homes near the harbors suit bluestone walks and shell or cobble driveways, with paver patios out back.',
      clearing: 'East and North Harwich have wooded lots still being opened up for building, often with a bog or pond edge that has to be respected.',
      landscaping: 'Lean, sandy soil across town makes soil preparation the difference between a planting that thrives and one that hangs on.',
      tree: 'Oak and pitch pine removals around the ponds and close-set village lots are common, along with stump grinding after older removals.'
    }
  },
  {
    slug: 'brewster-ma', name: 'Brewster', area: 'Lower Cape',
    villages: ['West Brewster', 'East Brewster', 'South Brewster', 'Brewster Center'],
    near: ['dennis-ma', 'harwich-ma', 'orleans-ma'],
    about: 'Brewster lines Cape Cod Bay with sea captains\' homes along Route 6A, wide tidal flats to the north and dozens of ponds and Nickerson State Park to the south.',
    land: 'Brewster is rolling and heavily wooded, with more freshwater ponds than almost any town on the Cape.',
    rules: OKH,
    notes: {
      hardscaping: 'Antique homes along 6A are best served by fieldstone walls, granite steps and brick or bluestone walks that look like they have always been there.',
      clearing: 'Wooded lots off the pond roads are the typical Brewster clearing job, with care taken near the water.',
      landscaping: 'The bay side is more sheltered than the sound, which opens up a wider plant list than most of the Lower Cape.',
      tree: 'Mature oaks shade a lot of Brewster yards, and pruning for light is as common here as removal.'
    }
  },
  {
    slug: 'chatham-ma', name: 'Chatham', area: 'Lower Cape',
    villages: ['Chatham Village', 'North Chatham', 'South Chatham', 'West Chatham', 'Chathamport'],
    near: ['harwich-ma', 'orleans-ma'],
    about: 'Chatham sits at the elbow of the Cape with water on three sides: Pleasant Bay, the Atlantic and Nantucket Sound.',
    land: 'Chatham is low, sandy and exposed. Wind and salt reach nearly every property, and coastal banks are a fact of life along the shore.',
    rules: 'Coastal banks, dunes and flood zones bring Conservation Commission review into many Chatham projects.',
    notes: {
      hardscaping: 'Chatham homes call for high-finish work: bluestone terraces, granite steps, cobble aprons and crisp joints.',
      clearing: 'Clearing in Chatham is usually selective, opening space on a built lot while keeping screening and staying clear of coastal resource areas.',
      landscaping: 'This is hydrangea and privet hedge country, and both need the right placement and care to stand up to the wind.',
      tree: 'Salt and wind stress show up as dieback in exposed trees, and hazard removals close to houses are routine.'
    }
  },
  {
    slug: 'orleans-ma', name: 'Orleans', area: 'Lower Cape',
    villages: ['East Orleans', 'South Orleans', 'Rock Harbor', 'Orleans Center'],
    near: ['brewster-ma', 'chatham-ma', 'eastham-ma'],
    about: 'Orleans touches Cape Cod Bay at Rock Harbor and the Atlantic at Nauset Beach, with Town Cove and Pleasant Bay cutting deep into town.',
    land: 'Orleans is rolling ground with a long, irregular shoreline, so many properties slope toward saltwater.',
    rules: OKH,
    notes: {
      hardscaping: 'Sloping lots above Town Cove and Pleasant Bay are natural sites for terraced walls, stone steps and patios set into the grade.',
      clearing: 'South Orleans has larger wooded properties where clearing and view work have to be planned around the shoreline buffers.',
      landscaping: 'East Orleans near Nauset takes ocean wind, while the coves are sheltered, and we plant accordingly.',
      tree: 'View pruning over the coves and removal of storm-damaged oaks are the most frequent requests.'
    }
  },
  {
    slug: 'eastham-ma', name: 'Eastham', area: 'Outer Cape',
    villages: ['North Eastham', 'Eastham Center'],
    near: ['orleans-ma', 'wellfleet-ma'],
    about: 'Eastham is the gateway to the Cape Cod National Seashore, a narrow town with bay beaches on one side and Nauset Marsh and the ocean on the other.',
    land: 'Eastham is flat to gently rolling, sandy and open, with a lot of former farmland now grown up in cedar, pine and oak.',
    rules: 'Properties inside or next to the National Seashore, and those near the marsh, carry extra limits on what can be cleared or built.',
    notes: {
      hardscaping: 'Level sandy lots make for efficient patio and walkway installs, and the base work goes quickly when the digging is all sand.',
      clearing: 'Old fields overtaken by cedar, cherry and bittersweet are the classic Eastham clearing job.',
      landscaping: 'Open exposure and very sandy soil reward native grasses, bayberry and beach plum over thirsty lawn.',
      tree: 'Red cedar and pitch pine dominate, and dead or leaning pines near cottages are the usual removals.'
    }
  },
  {
    slug: 'wellfleet-ma', name: 'Wellfleet', area: 'Outer Cape',
    villages: ['South Wellfleet', 'Wellfleet Center'],
    near: ['eastham-ma', 'truro-ma'],
    about: 'Wellfleet is harbor, oyster flats, kettle ponds and pine woods, with most of its land inside the Cape Cod National Seashore.',
    land: 'The ground is hilly and wooded, sandy throughout, with steep hollows running down to the harbor and the ponds.',
    rules: 'National Seashore boundaries and pond and harbor buffers shape what can be done on many Wellfleet lots.',
    notes: {
      hardscaping: 'Steep driveways and hillside house sites need retaining walls and stone steps more than big patios.',
      clearing: 'Clearing here is usually light-handed: opening a house site or a driveway through pine woods while leaving the rest alone.',
      landscaping: 'Low-maintenance native plantings fit Wellfleet best, in both look and survival rate.',
      tree: 'Pitch pine and oak close to cottages, often on a slope, make careful sectional removal the norm.'
    }
  },
  {
    slug: 'truro-ma', name: 'Truro', area: 'Outer Cape',
    villages: ['North Truro', 'Truro Center'],
    near: ['wellfleet-ma', 'provincetown-ma'],
    about: 'Truro is the most rural town on the Cape: rolling hills, deep hollows, the Pamet River and long empty beaches on both sides.',
    land: 'Truro is steep, sandy and wind-exposed, and much of it lies inside the Cape Cod National Seashore.',
    rules: 'Seashore district zoning and conservation rules limit clearing and site changes on many properties.',
    notes: {
      hardscaping: 'Hilltop homes need walls, steps and erosion-conscious drainage to hold sandy slopes in place.',
      clearing: 'Jobs here are small and selective, mostly driveways, house sites and keeping brush back from buildings.',
      landscaping: 'Wind is the main design factor, and plantings are chosen and placed to survive it.',
      tree: 'Stunted, wind-shaped pines and oaks rarely get large, but dead ones near houses and wires still need to come down.'
    }
  },
  {
    slug: 'provincetown-ma', name: 'Provincetown', area: 'Outer Cape',
    villages: ['West End', 'East End'],
    near: ['truro-ma'],
    about: 'Provincetown sits at the very tip of the Cape, a tightly built harbor town surrounded by dunes and National Seashore.',
    land: 'Lots are small, close together and pure sand, with tight access for equipment.',
    rules: 'Much of town is a local historic district, and visible exterior work can need approval.',
    notes: {
      hardscaping: 'Courtyard patios, brick and bluestone walks and small garden walls make the most of compact Provincetown lots.',
      clearing: 'There is little open land to clear, so the work is mostly brush removal and small-site prep with compact equipment.',
      landscaping: 'Small gardens here are seen up close by everyone walking past, so detail and plant quality matter.',
      tree: 'Tight quarters mean removals are done in sections and carried out by hand more often than not.'
    }
  }
];
