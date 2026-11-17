/*
 * Service pages (/ceramic-coating-rohini etc.) are built from this file.
 * Each slug also needs a small route file: src/app/<slug>/page.tsx (copy an existing one).
 * - Prices are "starting from" prices supplied by the owner. [CONFIRM: prices verified by client]
 * - Do NOT add warranty years, durability figures or product brand names here unless the owner
 *   has confirmed them in writing (see CONFIRM.md).
 */

export type ServiceImage = { src: string; alt: string };
export type PriceRow = { label: string; price: number; unit?: string };
export type Faq = { q: string; a: string };

export type Service = {
  slug: string;
  /** "Ceramic Coating" — used in the H1 as "<name> in Rohini, Delhi" */
  name: string;
  /** short label for menus and footers */
  navLabel: string;
  /** schema.org serviceType */
  serviceType: string;
  /** one or two sentences for cards */
  short: string;
  /** lowest price in ₹ */
  priceFrom: number;
  priceRows: PriceRow[];
  metaTitle: string;
  metaDescription: string;
  hero: ServiceImage;
  images: ServiceImage[];
  intro: string[];
  what: string[];
  benefits: { title: string; text: string }[];
  process: { title: string; text: string }[];
  priceText: string[];
  whyUs: string[];
  faqs: Faq[];
  related: string[];
};

export const PRICE_NOTE = "Final price depends on car size and condition.";
export const NEARBY = "Pitampura, Shalimar Bagh and Prashant Vihar";

const IMG = {
  foam: "/images/services/car-foam-wash-rohini.jpg",
  brush: "/images/services/car-interior-detailing-brush-rohini.jpg",
  polish: "/images/services/car-machine-polishing-rohini.jpg",
  coatPrep: "/images/services/car-paint-polishing-before-coating-rohini.jpg",
  wheel: "/images/services/alloy-wheel-cleaning-rohini.jpg",
  handWash: "/images/services/car-detailing-hand-wash-rohini.jpg",
  collage: "/images/home/car-detailing-polishing-collage-rohini.jpg",
  shelf: "/images/gallery/large/car-care-products-shelf-rohini-studio.jpg",
  vacuum: "/images/gallery/large/car-interior-vacuum-cleaner-rohini-studio.jpg",
  lights: "/images/gallery/large/hexagon-led-lights-detailing-bay-rohini.jpg",
  trolley: "/images/gallery/large/detailing-products-trolley-rohini-studio.jpg",
  floor: "/images/gallery/large/detailing-bay-floor-rohini-studio.jpg",
  water: "/images/gallery/large/water-filtration-system-rohini-studio.jpg",
  front: "/images/gallery/large/the-detailing-monk-studio-front-sector-11-rohini.jpg",
};

const STUDIO_SHELF: ServiceImage = { src: IMG.shelf, alt: "Shelves of car shampoos, polishes and coatings at The Detailing Monk studio in Rohini" };
const STUDIO_LIGHTS: ServiceImage = { src: IMG.lights, alt: "Hexagon LED inspection lights above the detailing bay at The Detailing Monk, Rohini" };
const STUDIO_FRONT: ServiceImage = { src: IMG.front, alt: "Front of The Detailing Monk studio in Sector 11, Rohini" };

export const services: Service[] = [
  /* ------------------------------------------------------------------ */
  {
    slug: "ceramic-coating-rohini",
    name: "Ceramic Coating",
    navLabel: "Ceramic Coating",
    serviceType: "Car ceramic coating",
    short: "A liquid coating that bonds with your car's paint for deep gloss, strong water beading and easier washing.",
    priceFrom: 9000,
    priceRows: [{ label: "Ceramic coating (paint preparation included)", price: 9000 }],
    metaTitle: "Ceramic Coating in Rohini, Delhi | The Detailing Monk",
    metaDescription:
      "Ceramic coating in Rohini, Delhi starting from ₹9,000. Paint is washed, decontaminated and polished before coating at our Sector 11 studio. Call or WhatsApp.",
    hero: { src: IMG.coatPrep, alt: "Detailer machine-polishing a black car bonnet before ceramic coating" },
    images: [
      { src: IMG.polish, alt: "Polishing pad working on a car panel to prepare the paint for ceramic coating" },
      { src: IMG.handWash, alt: "Detailer wiping down a black car beside a trolley of detailing products" },
      STUDIO_LIGHTS,
    ],
    intro: [
      "Ceramic coating is one of the most asked-for services at The Detailing Monk in Sector 11, Rohini. It gives your car a deep, glossy finish and a slick surface that water and dust find hard to cling to.",
      "We treat it as a full process, not a quick wipe-on job. Most of the time goes into preparing the paint, because a coating only looks as good as the surface underneath it.",
    ],
    what: [
      "A ceramic coating is a liquid that is applied by hand to clean, polished paint. As it cures, it bonds with the clear coat and forms a thin, hard, transparent layer over it. This layer sits on top of the paint and takes the daily wear that the paint would otherwise take.",
      "It is not a wax and it is not a film. Wax sits loosely on the surface and washes away in weeks. Paint protection film is a thick physical layer. Ceramic coating sits between the two: far longer lasting than wax, thinner and more affordable than film.",
      "A coating does not make a car scratch-proof, and it does not replace washing. What it does is keep the car looking freshly detailed for much longer and make every wash quicker.",
    ],
    benefits: [
      { title: "Deeper gloss", text: "Polished paint is sealed under a clear layer, so the colour looks richer and the reflections sharper." },
      { title: "Water beading", text: "Water forms beads and rolls off, carrying loose dust with it. The car dries faster and shows fewer water marks." },
      { title: "Easier washing", text: "Dirt, bird droppings and tree sap do not grip the slick surface as strongly, so a gentle wash is usually enough." },
      { title: "Protection from sun and grime", text: "The coating helps guard the clear coat against UV fading, oxidation and everyday road film on Delhi roads." },
    ],
    process: [
      { title: "Inspection", text: "We look at the paint under bright lights, note swirl marks, scratches and stains, and tell you honestly what result to expect." },
      { title: "Foam wash and decontamination", text: "The car is foam washed, then tar, iron particles and other bonded dirt are removed so the surface is truly clean." },
      { title: "Rubbing and polishing", text: "Machine compounding and polishing reduce swirl marks and light scratches. This step decides how glossy the final finish will be." },
      { title: "Surface wipe-down", text: "Polishing oils are removed with a panel wipe so the coating can bond directly with the paint." },
      { title: "Coating application", text: "The ceramic coating is applied panel by panel, levelled by hand and left to cure in the studio before the car goes back outside." },
    ],
    priceText: [
      "Ceramic coating at our Rohini studio starts from ₹9,000. The price changes with the size of the car, the condition of the paint and the coating you choose.",
      "A small hatchback with newer paint needs less correction than a large SUV with years of swirl marks. Send us a few photos on WhatsApp and we will give you a clear quote before you book.",
    ],
    whyUs: [
      "Paint correction is done before every coating. We do not coat over swirl marks and lock them in.",
      "You get straight advice. If your car does not need a coating yet, or a lighter option suits it better, we will say so.",
      "We explain how to wash and care for the coating, and offer a maintenance wash made for ceramic coated cars.",
      "The studio is easy to reach from across Rohini, and from Pitampura, Shalimar Bagh and Prashant Vihar.",
    ],
    faqs: [
      { q: "How long does a ceramic coating last?", a: "It depends on the coating you choose, how the car is used and how it is washed. We tell you the expected life of the specific coating before you book, and how to look after it so it lasts." },
      { q: "How long will you need my car?", a: "Most cars stay with us for one to two days. The paint has to be washed, decontaminated and polished before the coating goes on, and the coating then needs time to cure indoors." },
      { q: "Can I wash the car after ceramic coating?", a: "Yes, but give the coating time to cure first. We will tell you when the first wash is safe. After that, a gentle foam wash with a mild shampoo is all it needs." },
      { q: "Will ceramic coating remove scratches?", a: "The coating itself does not remove scratches. The rubbing and polishing we do before coating reduces swirl marks and light scratches. Deep scratches that have cut through the paint need paintwork." },
      { q: "Is ceramic coating worth it for a new car?", a: "A new car is the best time to coat, because the paint has the fewest marks and needs the least correction. It helps the car stay looking new for longer." },
      { q: "Do you coat alloy wheels as well?", a: "Yes. Alloy wheels can be ceramic coated to make brake dust easier to clean. Ask us to include it in your quote." },
    ],
    related: ["graphene-coating-rohini", "ppf-paint-protection-film-rohini", "car-rubbing-polishing-rohini"],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "ppf-paint-protection-film-rohini",
    name: "Paint Protection Film (PPF)",
    navLabel: "Paint Protection Film (PPF)",
    serviceType: "Paint protection film installation",
    short: "A clear 190-micron TPU film fitted over the paint to take stone chips, scratches and scuffs in its place.",
    priceFrom: 45000,
    priceRows: [{ label: "Paint protection film – 190-micron TPU, anti-yellowing", price: 45000 }],
    metaTitle: "Paint Protection Film (PPF) in Rohini | The Detailing Monk",
    metaDescription:
      "Paint protection film (PPF) in Rohini, Delhi from ₹45,000. 190-micron TPU, anti-yellowing film fitted at our Sector 11 studio. Call or WhatsApp for a quote.",
    hero: { src: IMG.handWash, alt: "Detailer preparing the paint of a black car at the studio before film installation" },
    images: [
      { src: IMG.coatPrep, alt: "Detailer machine-polishing a black car bonnet before paint protection film is fitted" },
      STUDIO_LIGHTS,
      STUDIO_FRONT,
    ],
    intro: [
      "Paint protection film, or PPF, is the strongest protection you can give your car's paint. At The Detailing Monk in Sector 11, Rohini, we fit a clear 190-micron TPU film with anti-yellowing properties.",
      "It is a physical layer over the paint. When a stone, a bag zip or a careless hand touches the car, the film takes the mark and the paint underneath stays safe.",
    ],
    what: [
      "PPF is a transparent, flexible film made of TPU (thermoplastic polyurethane). It is cut to the shape of each panel and fitted over the paint with a slip solution, then squeezed down so it sits flat and clear.",
      "At 190 microns, the film is many times thicker than any coating. That thickness is what lets it absorb small impacts from stone chips and road gravel. The anti-yellowing property helps the film stay clear instead of turning dull or yellow with sun exposure.",
      "PPF can cover the whole car or only the areas that take the most hits, such as the bonnet, bumpers, mirrors and door edges.",
    ],
    benefits: [
      { title: "Stone-chip defence", text: "The film absorbs small impacts from gravel and debris on highways and broken city roads." },
      { title: "Guards against scratches and scuffs", text: "Key marks, parking scuffs and scratches from washing land on the film, not on your paint." },
      { title: "Stays clear", text: "The anti-yellowing TPU film is made to stay transparent, so the colour of your car shows through as it is." },
      { title: "Protects resale value", text: "Original paint in good condition is one of the first things a buyer checks." },
    ],
    process: [
      { title: "Inspection and quote", text: "We check the paint, discuss full-body or partial coverage and give you a clear quote for your car." },
      { title: "Deep clean", text: "The car is foam washed and decontaminated. Any dust left under the film would show, so this step is slow and careful." },
      { title: "Paint correction", text: "Swirl marks and light scratches are polished out first. Film seals in whatever is underneath it." },
      { title: "Film fitting", text: "Each piece is positioned, squeezed out and wrapped around the panel edges where the panel shape allows." },
      { title: "Curing and final check", text: "The film is left to settle, then every panel is checked under the lights before handover." },
    ],
    priceText: [
      "Paint protection film at our Rohini studio starts from ₹45,000. The final price depends on the size of the car and how much of it you want covered.",
      "Full-body coverage for a large SUV costs more than a hatchback or a front-end package. Share your car model and the coverage you have in mind on WhatsApp for an exact quote.",
    ],
    whyUs: [
      "Fitting is done indoors at our studio, under inspection lights, so dust and lifted edges are caught before handover.",
      "We polish the paint before fitting, so the film goes over a clean, corrected surface.",
      "We explain clearly what PPF will and will not protect against, before you spend on it.",
      "Customers visit us from across Rohini and from nearby Pitampura, Shalimar Bagh and Prashant Vihar.",
    ],
    faqs: [
      { q: "What is the difference between PPF and ceramic coating?", a: "PPF is a thick physical film that absorbs stone chips and scratches. Ceramic coating is a thin liquid layer that adds gloss and makes cleaning easier but cannot stop a stone chip. Many owners use PPF on the paint and add a coating for easy washing." },
      { q: "Will the film turn yellow?", a: "The TPU film we fit has anti-yellowing properties, which helps it stay clear. Regular gentle washing also keeps it looking fresh." },
      { q: "Can PPF be removed later?", a: "Yes. The film can be removed by a trained installer. It is designed to come off without harming original factory paint." },
      { q: "Can I get PPF on only some parts of the car?", a: "Yes. Many owners protect only the high-impact areas such as the bonnet, bumpers, mirrors and door edges. We will quote for whichever coverage you choose." },
      { q: "How long does the installation take?", a: "It depends on the coverage. A full-body installation usually takes a few days, because the paint is cleaned and corrected first and the film needs time to settle. We give you a timeline with the quote." },
    ],
    related: ["ceramic-coating-rohini", "graphene-coating-rohini", "car-rubbing-polishing-rohini"],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "graphene-coating-rohini",
    name: "Graphene Coating",
    navLabel: "Graphene Coating",
    serviceType: "Car graphene coating",
    short: "A graphene-infused protective coating for owners who want a slick, glossy, water-repellent finish.",
    priceFrom: 22000,
    priceRows: [{ label: "Graphene coating (paint preparation included)", price: 22000 }],
    metaTitle: "Graphene Coating in Rohini, Delhi | The Detailing Monk",
    metaDescription:
      "Graphene coating in Rohini, Delhi starting from ₹22,000. Paint is cleaned and polished before coating at our Sector 11 studio. Call or WhatsApp for a quote.",
    hero: { src: IMG.polish, alt: "Machine polisher refining a car panel before graphene coating" },
    images: [
      { src: IMG.coatPrep, alt: "Detailer polishing the bonnet of a black car before a protective coating is applied" },
      STUDIO_SHELF,
      STUDIO_LIGHTS,
    ],
    intro: [
      "Graphene coating is the premium coating option at The Detailing Monk in Sector 11, Rohini. It is chosen by owners who want strong gloss, a very slick surface and a car that is easy to keep clean.",
      "As with every coating we apply, the result depends on the preparation. We wash, decontaminate and polish the paint before the coating touches the car.",
    ],
    what: [
      "A graphene coating is a liquid paint coating that has graphene blended into it. Like a ceramic coating, it is applied by hand to polished paint, bonds with the clear coat and cures into a thin protective layer.",
      "Coating makers add graphene to give the layer a slicker feel and to reduce water spotting, which is a common complaint on cars that are parked outdoors or washed with hard water.",
      "It is still a coating, not armour. It will not stop stone chips or deep scratches. For that level of protection, paint protection film is the right choice.",
    ],
    benefits: [
      { title: "Slick, glossy finish", text: "The surface feels smooth to the touch and gives the paint a deep, wet-look shine." },
      { title: "Strong water repellency", text: "Water beads up and slides away, taking loose dirt with it and helping the car dry cleaner." },
      { title: "Fewer water spots", text: "A slick surface gives minerals less to hold on to, which helps on cars washed with hard water." },
      { title: "Easier upkeep", text: "Dust and grime release more easily, so regular washes are quicker and gentler on the paint." },
    ],
    process: [
      { title: "Inspection", text: "We study the paint under lights and agree on how much correction the car needs." },
      { title: "Wash and decontamination", text: "A foam wash is followed by removal of tar, iron fallout and other bonded dirt." },
      { title: "Paint correction", text: "Rubbing and polishing reduce swirl marks and light scratches and bring out the gloss." },
      { title: "Panel wipe", text: "All polishing residue is removed so the coating bonds with clean paint." },
      { title: "Graphene coating", text: "The coating is applied in small sections, levelled by hand and left to cure inside the studio." },
    ],
    priceText: [
      "Graphene coating at our Rohini studio starts from ₹22,000. The size of the car and the condition of its paint decide the final price.",
      "Cars with heavy swirl marks or oxidation need more polishing time before coating. We will look at your car, or at photos sent on WhatsApp, and give you a quote before any work starts.",
    ],
    whyUs: [
      "The paint is corrected before coating, so you see gloss, not sealed-in swirl marks.",
      "We compare graphene and ceramic coating for your car and usage, and recommend the one that makes sense.",
      "Aftercare is explained in simple steps, and maintenance washes are available at the studio.",
      "We are in Sector 11, Rohini, a short drive from Pitampura, Shalimar Bagh and Prashant Vihar.",
    ],
    faqs: [
      { q: "Is graphene coating better than ceramic coating?", a: "Both protect the paint and add gloss. Graphene coatings are generally slicker and are made to resist water spotting better, and they cost more. We will suggest one based on your car, where it is parked and your budget." },
      { q: "How long does a graphene coating last?", a: "That depends on the product, how the car is used and how it is washed. We will tell you the expected life of the coating we recommend before you book." },
      { q: "Does graphene coating need special care?", a: "No special products are needed. Wash the car regularly with a mild shampoo, avoid harsh automatic brushes and dry it with a clean microfibre towel." },
      { q: "Can it be applied on an older car?", a: "Yes. Older paint usually needs more rubbing and polishing first. Once the paint is corrected, the coating helps keep that finish." },
      { q: "How many days will the car stay at the studio?", a: "Usually one to two days, to allow for paint correction, coating and curing time." },
    ],
    related: ["ceramic-coating-rohini", "ppf-paint-protection-film-rohini", "car-foam-wash-rohini"],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "car-interior-dry-cleaning-rohini",
    name: "Car Interior Dry Cleaning",
    navLabel: "Interior Dry Cleaning",
    serviceType: "Car interior dry cleaning",
    short: "Deep cleaning of seats, roof, carpets, dashboard and door pads, with steam, AC vent and odour treatments as add-ons.",
    priceFrom: 1500,
    priceRows: [
      { label: "Interior dry cleaning", price: 1500 },
      { label: "Dry cleaning + AC vents foam cleaning", price: 1800 },
      { label: "Dry cleaning + steam sanitization", price: 2000 },
      { label: "Smoke / bad smell removal", price: 2500 },
      { label: "Spot cleaning with steam", price: 300, unit: "per spot" },
    ],
    metaTitle: "Car Interior Dry Cleaning in Rohini | The Detailing Monk",
    metaDescription:
      "Car interior dry cleaning in Rohini, Delhi from ₹1,500. Seats, roof, carpets and dashboard cleaned; steam sanitization and AC vent cleaning available. Call us.",
    hero: { src: IMG.brush, alt: "Detailing brush cleaning dust from a car's gear selector and centre console" },
    images: [
      { src: IMG.vacuum, alt: "Wet and dry vacuum cleaner used for car interior dry cleaning at the Rohini studio" },
      { src: IMG.trolley, alt: "Trolley of interior cleaning sprays, brushes and microfibre cloths" },
      STUDIO_SHELF,
    ],
    intro: [
      "You spend more time inside your car than looking at it from outside. Interior dry cleaning at The Detailing Monk in Sector 11, Rohini, deep cleans the whole cabin so it looks, feels and smells fresh again.",
      "It is the right service after a monsoon, a long road trip, a spilled drink or simply a year of daily office runs.",
    ],
    what: [
      "Interior dry cleaning is a deep clean of every surface inside the car: seats, roof lining, carpets, floor mats, dashboard, door pads, boot and the small gaps between them. Cleaning foam and brushes loosen the dirt, and a wet and dry vacuum pulls it out along with most of the moisture.",
      "It is called dry cleaning because the cabin is not soaked with water. Fabric is cleaned with controlled moisture so it dries quickly and does not smell damp afterwards.",
      "You can add steam sanitization, AC vent foam cleaning, spot treatment for tough stains or a smoke and bad smell removal treatment, depending on what your cabin needs.",
    ],
    benefits: [
      { title: "Removes built-up dirt and stains", text: "Dust, sweat marks, food spills and mud are lifted from fabric, leather and plastics." },
      { title: "A healthier cabin", text: "Steam sanitization and AC vent cleaning help reduce germs and the musty smell from the air vents." },
      { title: "Fresh smell", text: "Odours from smoke, food, pets or dampness are treated at the source, not covered with perfume." },
      { title: "Protects the interior", text: "Clean, conditioned surfaces age more slowly and keep the car pleasant to own and easier to sell." },
    ],
    process: [
      { title: "Cabin check", text: "We note stains, odours and delicate surfaces, and remove floor mats and loose items." },
      { title: "Dry vacuum", text: "Seats, carpets, boot and every gap are vacuumed to remove loose dust and grit." },
      { title: "Foam and brush clean", text: "Seats, roof lining, door pads and carpets are cleaned with foam and soft brushes, then extracted." },
      { title: "Dashboard and trim", text: "Dashboard, console, vents, switches and door pockets are detailed with brushes and microfibre cloths." },
      { title: "Add-on treatments and drying", text: "Steam, AC vent cleaning or odour treatment is done if chosen, and the cabin is dried before handover." },
    ],
    priceText: [
      "Interior dry cleaning starts from ₹1,500. Dry cleaning with AC vents foam cleaning starts from ₹1,800, and dry cleaning with steam sanitization from ₹2,000. Smoke or bad smell removal starts from ₹2,500, and spot cleaning with steam is ₹300 per spot.",
      "Bigger cabins, seven-seaters and very heavily soiled interiors take longer and are priced accordingly. We will confirm the price after seeing the car or photos of the cabin.",
    ],
    whyUs: [
      "Controlled moisture: fabric is cleaned and extracted, not soaked, so the car does not come back damp.",
      "Brushes and cleaners are chosen for each surface, whether fabric, leather, plastic or roof lining.",
      "Odours are treated at the source, including the AC vents, where most bad smells begin.",
      "Easy drop-off at our Sector 11 studio for customers from Rohini, Pitampura, Shalimar Bagh and Prashant Vihar.",
    ],
    faqs: [
      { q: "How long does interior dry cleaning take?", a: "Usually a few hours, depending on the size of the cabin and how dirty it is. Add-ons such as steam sanitization or odour removal need extra time. We will give you a pick-up time when you drop the car." },
      { q: "Will the seats be wet afterwards?", a: "The seats may feel slightly damp at first, but they are extracted and dried before handover. Leaving the windows a little open for a short while helps finish the drying." },
      { q: "Can you remove every stain?", a: "Most everyday stains come out. Old, deep or dye-based stains may only lighten. We will tell you what to expect before we start, and spot cleaning with steam is available for tough marks." },
      { q: "How often should I get the interior cleaned?", a: "For a car in daily use, every six months is a sensible routine, and once after the monsoon. Cars with children, pets or light-coloured seats may need it more often." },
      { q: "Do you treat bad smell from the AC?", a: "Yes. AC vents foam cleaning targets the smell and bacteria in the vents, and a separate smoke and bad smell removal treatment is available for stronger odours." },
      { q: "Is it safe for leather seats?", a: "Yes. Leather is cleaned with a suitable cleaner and soft brush, not harsh chemicals, and wiped down gently." },
    ],
    related: ["car-foam-wash-rohini", "monthly-car-care-package-rohini", "car-rubbing-polishing-rohini"],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "car-rubbing-polishing-rohini",
    name: "Car Rubbing & Polishing",
    navLabel: "Rubbing & Polishing",
    serviceType: "Car rubbing, compounding and polishing",
    short: "Compounding and polishing that reduces swirl marks, light scratches and dullness and brings the gloss back.",
    priceFrom: 3000,
    priceRows: [
      { label: "Rubbing / compounding & polishing", price: 3000 },
      { label: "Machine rubbing & polishing", price: 3500 },
    ],
    metaTitle: "Car Rubbing & Polishing in Rohini | The Detailing Monk",
    metaDescription:
      "Car rubbing, compounding and polishing in Rohini, Delhi from ₹3,000. Reduce swirl marks, light scratches and dull paint at our Sector 11 studio. Call us.",
    hero: { src: IMG.polish, alt: "Machine polisher working on a car panel during rubbing and polishing" },
    images: [
      { src: IMG.coatPrep, alt: "Detailer polishing the bonnet of a black car with a machine polisher" },
      { src: IMG.collage, alt: "Collage of a car being foam washed and machine polished" },
      STUDIO_LIGHTS,
    ],
    intro: [
      "If your car's paint looks dull, hazy or covered in fine circular scratches under the sun, it needs rubbing and polishing. At The Detailing Monk in Sector 11, Rohini, this service brings back the depth and shine that the paint had when it was new.",
      "It is also the foundation for any ceramic or graphene coating, because a coating should only go on corrected paint.",
    ],
    what: [
      "Rubbing, also called compounding, uses a mildly abrasive compound to level the top of the clear coat. This is what removes or reduces swirl marks, light scratches, water spots and oxidation.",
      "Polishing follows with a finer product. It clears the haze left by compounding and refines the surface until it reflects cleanly.",
      "The work removes a very small amount of clear coat, so it has to be done with care and only as much as the paint needs. It cannot fix scratches that have gone through the paint to the primer or metal. Those need paintwork.",
    ],
    benefits: [
      { title: "Reduces swirl marks", text: "The fine circular scratches caused by dusty cloths and automatic washes are levelled out." },
      { title: "Brings back gloss", text: "Dull, faded or oxidised paint regains depth, colour and clear reflections." },
      { title: "Removes light defects", text: "Light scratches, water spots and stains in the clear coat are reduced or removed." },
      { title: "Prepares the paint for protection", text: "A corrected surface is the right base for wax, ceramic or graphene coating." },
    ],
    process: [
      { title: "Wash and decontamination", text: "The car is foam washed and bonded dirt is removed, so nothing is dragged across the paint during polishing." },
      { title: "Paint inspection", text: "We check the paint under lights and choose the least aggressive method that will do the job." },
      { title: "Masking", text: "Rubber seals, plastic trim and badges are taped off to protect them from polish." },
      { title: "Rubbing / compounding", text: "Defects are levelled panel by panel, by machine where the paint needs it." },
      { title: "Polishing and finish", text: "A finer polish refines the gloss, residue is wiped off and the paint is checked again in the light." },
    ],
    priceText: [
      "Rubbing, compounding and polishing starts from ₹3,000, and machine rubbing and polishing from ₹3,500. Car size and paint condition decide the final price.",
      "Heavily swirled or oxidised paint needs more stages than a newer car that only needs a light polish. We will check your car and tell you the price before starting.",
    ],
    whyUs: [
      "We use the mildest method that works, to keep as much clear coat on your car as possible.",
      "Work is checked under inspection lights, where swirl marks cannot hide.",
      "We tell you plainly which scratches will polish out and which need paintwork.",
      "Our studio in Sector 11, Rohini is close to Pitampura, Shalimar Bagh and Prashant Vihar.",
    ],
    faqs: [
      { q: "What is the difference between rubbing and polishing?", a: "Rubbing, or compounding, is the correcting step that levels the clear coat to reduce scratches and oxidation. Polishing is the finishing step that refines the surface and brings out the gloss. Most cars need both." },
      { q: "Will polishing remove all scratches?", a: "It reduces swirl marks and light scratches in the clear coat. A scratch you can feel with your fingernail has usually gone too deep and will only look less noticeable." },
      { q: "Is rubbing safe for my car's paint?", a: "Yes, when it is done correctly and not too often. Each session removes a very thin layer of clear coat, which is why we only correct as much as the paint needs." },
      { q: "How long does the shine last?", a: "The corrected finish stays until new scratches are put in, usually by poor washing. Protecting the paint with a wax or coating and washing gently keeps the shine much longer." },
      { q: "How long does the job take?", a: "Most cars are ready the same day. Cars with heavier defects, or those getting a coating afterwards, may need to stay longer." },
    ],
    related: ["ceramic-coating-rohini", "graphene-coating-rohini", "car-foam-wash-rohini"],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "car-foam-wash-rohini",
    name: "Car Foam Wash & Waxing",
    navLabel: "Foam Wash & Waxing",
    serviceType: "Car foam wash and waxing",
    short: "A gentle foam wash that lifts dirt before the paint is touched, with vacuuming and hand or machine waxing options.",
    priceFrom: 400,
    priceRows: [
      { label: "Foam wash + hand waxing", price: 400 },
      { label: "Vacuum + foam wash", price: 500 },
      { label: "Vacuum + foam wash + hand waxing", price: 600 },
      { label: "Ceramic coated car maintenance wash", price: 700 },
      { label: "Vacuum + foam wash + machine waxing", price: 1000 },
      { label: "Premium wash", price: 1000 },
    ],
    metaTitle: "Car Foam Wash & Waxing in Rohini | The Detailing Monk",
    metaDescription:
      "Car foam wash in Rohini, Delhi from ₹400. Foam wash with vacuuming, hand or machine waxing, and maintenance wash for ceramic coated cars. Sector 11 studio.",
    hero: { src: IMG.foam, alt: "Black sedan covered in thick washing foam during a foam wash" },
    images: [
      { src: IMG.wheel, alt: "Detailer cleaning an alloy wheel and tyre during a car wash" },
      { src: IMG.handWash, alt: "Detailer wiping a freshly washed black car with a microfibre cloth" },
      { src: IMG.water, alt: "Water filtration system used for car washing at The Detailing Monk, Rohini" },
    ],
    intro: [
      "A good wash is the simplest way to keep a car looking new, and a bad one is the most common cause of swirl marks. At The Detailing Monk in Sector 11, Rohini, every wash starts with foam.",
      "Choose a quick foam wash, add vacuuming and waxing, or book a premium wash when the car needs more attention.",
    ],
    what: [
      "In a foam wash, the car is covered in a thick layer of shampoo foam and left to dwell for a few minutes. The foam softens and loosens dust and road grime so that most of it rinses away before a wash mitt ever touches the paint.",
      "That matters because scratches are made when dry dirt is rubbed across the surface. Less rubbing means fewer swirl marks over the life of the car.",
      "Waxing adds a thin protective layer after the wash. Hand waxing gives a quick shine and some water beading. Machine waxing spreads the wax more evenly and works it in for a deeper gloss.",
    ],
    benefits: [
      { title: "Gentle on paint", text: "Dirt is loosened by foam first, which reduces the rubbing that causes swirl marks." },
      { title: "Cleans where cloths cannot", text: "Foam reaches panel gaps, grilles, badges and wheel arches that a bucket wash misses." },
      { title: "Shine and protection", text: "Waxing leaves a glossy, water-repellent layer that keeps the car cleaner between washes." },
      { title: "Safe for coated cars", text: "Our maintenance wash is made for ceramic coated cars and helps the coating keep performing." },
    ],
    process: [
      { title: "Pre-rinse", text: "Loose dust and mud are rinsed off with a pressure washer, including the wheel arches." },
      { title: "Foam and dwell", text: "The whole car is covered in foam, which is left to loosen the dirt." },
      { title: "Contact wash and rinse", text: "The paint is washed with a soft mitt from the top down, then rinsed clean." },
      { title: "Wheels and tyres", text: "Alloys and tyres are cleaned separately, and tyres are dressed." },
      { title: "Dry, vacuum and wax", text: "The car is dried with microfibre towels. The cabin is vacuumed and wax is applied if included in your package." },
    ],
    priceText: [
      "Foam wash with hand waxing starts from ₹400. Vacuum with foam wash starts from ₹500, or ₹600 with hand waxing and ₹1,000 with machine waxing.",
      "The maintenance wash for ceramic coated cars starts from ₹700 and the premium wash from ₹1,000. Larger cars and very dirty cars are priced a little higher.",
    ],
    whyUs: [
      "Foam first, contact later: the method is chosen to protect your paint, not just to finish quickly.",
      "Clean wash mitts and microfibre towels, not old dusters that scratch.",
      "A dedicated maintenance wash for cars with ceramic coating.",
      "Walk in or book ahead at our Sector 11 studio, near Pitampura, Shalimar Bagh and Prashant Vihar.",
    ],
    faqs: [
      { q: "How is a foam wash different from a normal car wash?", a: "A normal wash rubs dirt off with a cloth or brush. A foam wash loosens most of the dirt first, so there is far less rubbing on the paint and a much lower chance of swirl marks." },
      { q: "How long does a foam wash take?", a: "A foam wash usually takes under an hour. Packages with vacuuming and waxing, and the premium wash, take longer." },
      { q: "What is included in the premium wash?", a: "The premium wash covers cleaning, restoration and protection for both the interior and the exterior. Ask us on WhatsApp for the full list of what is done on your car." },
      { q: "Should I choose hand waxing or machine waxing?", a: "Hand waxing is a quick top-up of shine and protection. Machine waxing gives a more even, deeper gloss and is the better pick before a function or if the paint looks flat." },
      { q: "How often should I get my car washed?", a: "For a daily-use car in Delhi, once every one to two weeks keeps dust and bird droppings from damaging the paint." },
      { q: "My car is ceramic coated. Which wash should I pick?", a: "Choose the ceramic coated car maintenance wash. It is designed to clean the coating safely and help it keep beading water." },
    ],
    related: ["monthly-car-care-package-rohini", "car-interior-dry-cleaning-rohini", "car-rubbing-polishing-rohini"],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: "monthly-car-care-package-rohini",
    name: "Monthly Car Care Package",
    navLabel: "Monthly Car Care Package",
    serviceType: "Monthly car care package",
    short: "Silver and Gold monthly plans that keep your car clean through the month at a better price than single visits.",
    priceFrom: 1800,
    priceRows: [{ label: "Monthly car care package (Silver / Gold)", price: 1800 }],
    metaTitle: "Monthly Car Care Package in Rohini | The Detailing Monk",
    metaDescription:
      "Monthly car care packages in Rohini, Delhi from ₹1,800. Silver and Gold plans for regular washing and upkeep at our Sector 11 studio. Call or WhatsApp us.",
    hero: { src: IMG.handWash, alt: "Detailer cleaning a black car at the studio as part of regular car care" },
    images: [
      { src: IMG.foam, alt: "Black sedan covered in foam during a regular foam wash" },
      { src: IMG.brush, alt: "Detailing brush cleaning a car's centre console" },
      { src: IMG.floor, alt: "Chequered floor of the detailing bay at The Detailing Monk studio, Rohini" },
    ],
    intro: [
      "A car that is cleaned regularly never gets truly dirty. The Monthly Car Care Package at The Detailing Monk in Sector 11, Rohini, is for owners who want their car looked after through the month without thinking about it each time.",
      "It comes in two plans, Silver and Gold, so you can pick the level of care that suits your car and how much you drive.",
    ],
    what: [
      "The monthly package is a prepaid plan for regular care visits at our studio. You pay once for the month and bring the car in for its scheduled washes and upkeep, which works out better value than paying for each visit separately.",
      "The Silver plan covers the essentials for a daily-use car. The Gold plan adds more care for owners who want the car kept at a higher standard, inside and out.",
      "What each plan includes, and the number of visits in the month, is shared with you when you enquire, so you know exactly what you are paying for before you start.",
    ],
    benefits: [
      { title: "Always clean", text: "Regular visits stop dust, bird droppings and road grime from building up and marking the paint." },
      { title: "Better value", text: "A monthly plan costs less than booking the same visits one at a time." },
      { title: "Paint-safe washing", text: "Every wash uses our foam wash method, which is gentler on paint than roadside cleaning with a dry cloth." },
      { title: "One studio that knows your car", text: "The same team sees the car through the month and can point out small issues early." },
    ],
    process: [
      { title: "Choose a plan", text: "Tell us your car and how you use it, and we will explain the Silver and Gold plans." },
      { title: "Book your visits", text: "Pick days and times that suit you through the month. A WhatsApp message is enough." },
      { title: "Regular care", text: "On each visit the car is cleaned as per your plan, using the same careful process as our single washes." },
      { title: "Quick check", text: "We look over the paint and cabin and let you know if anything needs attention." },
      { title: "Renew or change", text: "At the end of the month, continue with the same plan, switch plans or stop. There is no lock-in." },
    ],
    priceText: [
      "Monthly car care packages start from ₹1,800. The price depends on the plan you choose, Silver or Gold, and the size of your car.",
      "Message us on WhatsApp with your car model and we will send the details and price of both plans.",
    ],
    whyUs: [
      "The same foam wash method and clean towels on every visit, so regular washing does not mean regular scratches.",
      "Flexible booking by phone or WhatsApp.",
      "Clear plans with the inclusions explained before you pay.",
      "A convenient stop in Sector 11 for car owners in Rohini, Pitampura, Shalimar Bagh and Prashant Vihar.",
    ],
    faqs: [
      { q: "What is the difference between the Silver and Gold plans?", a: "Silver covers the essential regular care for a daily-use car. Gold includes more care for owners who want a higher standard through the month. We share the full inclusions of both plans when you enquire." },
      { q: "How many washes do I get in a month?", a: "The number of visits depends on the plan. We will confirm it, along with what is done on each visit, before you sign up." },
      { q: "Do I have to commit for several months?", a: "No. The package runs month to month. You can renew, switch between Silver and Gold, or stop at the end of any month." },
      { q: "Can I use the package for more than one car?", a: "A package is for one car, because the price depends on car size. Ask us about plans for a second car." },
      { q: "Is the monthly package suitable for a ceramic coated car?", a: "Yes. Tell us the car is coated and we will wash it the right way for the coating." },
    ],
    related: ["car-foam-wash-rohini", "car-interior-dry-cleaning-rohini", "ceramic-coating-rohini"],
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);

/** "₹9,000" in Indian digit grouping */
export const formatINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;
