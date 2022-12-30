import { Router } from 'express';
import Models from '../models';
const router = Router();


async function seedDatabase() {

    function getRndInteger(min, max) {
        const rndNum = Math.floor(Math.random() * (max - min + 1)) + min;

        if (rndNum !== 0) {
            return rndNum;
        }
        else {
            getRndInteger(min, max);
        }
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // S&P500 index company list
    const sp500 = {
        "MMM": "3M",
        "AOS": "A.','O.','Smith",
        "ABT": "Abbott",
        "ABBV": "AbbVie",
        "ACN": "Accenture",
        "ATVI": "Activision Blizzard",
        "ADM": "ADM",
        "ADBE": "Adobe Inc.",
        "ADP": "ADP",
        "AAP": "Advance Auto Parts",
        "AES": "AES Corporation",
        "AFL": "Aflac",
        "A": "Agilent Technologies",
        "APD": "Air Products and Chemicals",
        "AKAM": "Akamai",
        "ALK": "Alaska Air Group",
        "ALB": "Albemarle Corporation",
        "ARE": "Alexandria Real Estate Equities",
        "ALGN": "Align Technology",
        "ALLE": "Allegion",
        "LNT": "Alliant Energy",
        "ALL": "Allstate",
        "GOOGL": "Alphabet Inc.','(Class A)",
        "GOOG": "Alphabet Inc.','(Class C)",
        "MO": "Altria",
        "AMZN": "Amazon",
        "AMCR": "Amcor",
        "AMD": "AMD",
        "AEE": "Ameren",
        "AAL": "American Airlines Group",
        "AEP": "American Electric Power",
        "AXP": "American Express",
        "AIG": "American International Group",
        "AMT": "American Tower",
        "AWK": "American Water Works",
        "AMP": "Ameriprise Financial",
        "ABC": "AmerisourceBergen",
        "AME": "Ametek",
        "AMGN": "Amgen",
        "APH": "Amphenol",
        "ADI": "Analog Devices",
        "ANSS": "Ansys",
        "AON": "Aon",
        "APA": "APA Corporation",
        "AAPL": "Apple Inc.",
        "AMAT": "Applied Materials",
        "APTV": "Aptiv",
        "ACGL": "Arch Capital Group",
        "ANET": "Arista Networks",
        "AJG": "Arthur J.','Gallagher & Co.",
        "AIZ": "Assurant",
        "T": "AT&T",
        "ATO": "Atmos Energy",
        "ADSK": "Autodesk",
        "AZO": "AutoZone",
        "AVB": "AvalonBay Communities",
        "AVY": "Avery Dennison",
        "BKR": "Baker Hughes",
        "BALL": "Ball Corporation",
        "BAC": "Bank of America",
        "BBWI": "Bath & Body Works, Inc.",
        "BAX": "Baxter International",
        "BDX": "Becton Dickinson",
        "WRB": "Berkley",
        "BRK.B": "Berkshire Hathaway",
        "BBY": "Best Buy",
        "BIO": "Bio-Rad",
        "TECH": "Bio-Techne",
        "BIIB": "Biogen",
        "BLK": "BlackRock",
        "BK": "BNY Mellon",
        "BA": "Boeing",
        "BKNG": "Booking Holdings",
        "BWA": "BorgWarner",
        "BXP": "Boston Properties",
        "BSX": "Boston Scientific",
        "BMY": "Bristol Myers Squibb",
        "AVGO": "Broadcom Inc.",
        "BR": "Broadridge Financial Solutions",
        "BRO": "Brown & Brown",
        "BF.B": "Brown–Forman",
        "CHRW": "C.H.','Robinson",
        "CDNS": "Cadence Design Systems",
        "CZR": "Caesars Entertainment",
        "CPT": "Camden Property Trust",
        "CPB": "Campbell Soup Company",
        "COF": "Capital One",
        "CAH": "Cardinal Health",
        "KMX": "CarMax",
        "CCL": "Carnival",
        "CARR": "Carrier Global",
        "CTLT": "Catalent",
        "CAT": "Caterpillar Inc.",
        "CBOE": "Cboe Global Markets",
        "CBRE": "CBRE Group",
        "CDW": "CDW",
        "CE": "Celanese",
        "CNC": "Centene Corporation",
        "CNP": "CenterPoint Energy",
        "CDAY": "Ceridian",
        "CF": "CF Industries",
        "CRL": "Charles River Laboratories",
        "SCHW": "Charles Schwab Corporation",
        "CHTR": "Charter Communications",
        "CVX": "Chevron Corporation",
        "CMG": "Chipotle Mexican Grill",
        "CB": "Chubb Limited",
        "CHD": "Church & Dwight",
        "CI": "Cigna",
        "CINF": "Cincinnati Financial",
        "CTAS": "Cintas",
        "CSCO": "Cisco",
        "C": "Citigroup",
        "CFG": "Citizens Financial Group",
        "CLX": "Clorox",
        "CME": "CME Group",
        "CMS": "CMS Energy",
        "KO": "The Coca-Cola Company",
        "CTSH": "Cognizant",
        "CL": "Colgate-Palmolive",
        "CMCSA": "Comcast",
        "CMA": "Comerica",
        "CAG": "Conagra Brands",
        "COP": "ConocoPhillips",
        "ED": "Consolidated Edison",
        "STZ": "Constellation Brands",
        "CEG": "Constellation Energy",
        "COO": "CooperCompanies",
        "CPRT": "Copart",
        "GLW": "Corning Inc.",
        "CTVA": "Corteva",
        "CSGP": "CoStar Group",
        "COST": "Costco",
        "CTRA": "Coterra",
        "CCI": "Crown Castle",
        "CSX": "CSX",
        "CMI": "Cummins",
        "CVS": "CVS Health",
        "DHI": "D.R.','Horton",
        "DHR": "Danaher Corporation",
        "DRI": "Darden Restaurants",
        "DVA": "DaVita Inc.",
        "DE": "John Deere",
        "DAL": "Delta Air Lines",
        "XRAY": "Dentsply Sirona",
        "DVN": "Devon Energy",
        "DXCM": "Dexcom",
        "FANG": "Diamondback Energy",
        "DLR": "Digital Realty",
        "DFS": "Discover Financial",
        "DISH": "Dish Network",
        "DIS": "Disney",
        "DG": "Dollar General",
        "DLTR": "Dollar Tree",
        "D": "Dominion Energy",
        "DPZ": "Domino's",
        "DOV": "Dover Corporation",
        "DOW": "Dow Inc.",
        "DTE": "DTE Energy",
        "DUK": "Duke Energy",
        "DD": "DuPont",
        "DXC": "DXC Technology",
        "EMN": "Eastman Chemical Company",
        "ETN": "Eaton Corporation",
        "EBAY": "eBay",
        "ECL": "Ecolab",
        "EIX": "Edison International",
        "EW": "Edwards Lifesciences",
        "EA": "Electronic Arts",
        "ELV": "Elevance Health",
        "LLY": "Eli Lilly and Company",
        "EMR": "Emerson Electric",
        "ENPH": "Enphase",
        "ETR": "Entergy",
        "EOG": "EOG Resources",
        "EPAM": "EPAM Systems",
        "EQT": "EQT",
        "EFX": "Equifax",
        "EQIX": "Equinix",
        "EQR": "Equity Residential",
        "ESS": "Essex Property Trust",
        "EL": "The Estée Lauder Companies",
        "ETSY": "Etsy",
        "RE": "Everest Re",
        "EVRG": "Evergy",
        "ES": "Eversource",
        "EXC": "Exelon",
        "EXPE": "Expedia Group",
        "EXPD": "Expeditors International",
        "EXR": "Extra Space Storage",
        "XOM": "ExxonMobil",
        "FFIV": "F5, Inc.",
        "FDS": "FactSet",
        "FAST": "Fastenal",
        "FRT": "Federal Realty",
        "FDX": "FedEx",
        "FITB": "Fifth Third Bank",
        "FRC": "First Republic Bank",
        "FSLR": "First Solar",
        "FE": "FirstEnergy",
        "FIS": "FIS",
        "FISV": "Fiserv",
        "FLT": "Fleetcor",
        "FMC": "FMC Corporation",
        "F": "Ford Motor Company",
        "FTNT": "Fortinet",
        "FTV": "Fortive",
        "FOXA": "Fox Corporation (Class A)",
        "FOX": "Fox Corporation (Class B)",
        "BEN": "Franklin Templeton",
        "FCX": "Freeport-McMoRan",
        "GRMN": "Garmin",
        "IT": "Gartner",
        "GEN": "Gen Digital Inc.",
        "GNRC": "Generac",
        "GD": "General Dynamics",
        "GE": "General Electric",
        "GIS": "General Mills",
        "GM": "General Motors",
        "GPC": "Genuine Parts Company",
        "GILD": "Gilead Sciences",
        "GL": "Globe Life",
        "GPN": "Global Payments",
        "GS": "Goldman Sachs",
        "HAL": "Halliburton",
        "HIG": "Hartford (The)",
        "HAS": "Hasbro",
        "HCA": "HCA Healthcare",
        "PEAK": "Healthpeak",
        "HSIC": "Henry Schein",
        "HSY": "Hershey's",
        "HES": "Hess Corporation",
        "HPE": "Hewlett Packard Enterprise",
        "HLT": "Hilton Worldwide",
        "HOLX": "Hologic",
        "HD": "The Home Depot",
        "HON": "Honeywell",
        "HRL": "Hormel Foods",
        "HST": "Host Hotels & Resorts",
        "HWM": "Howmet Aerospace",
        "HPQ": "HP Inc.",
        "HUM": "Humana",
        "HBAN": "Huntington Bancshares",
        "HII": "Huntington Ingalls Industries",
        "IBM": "IBM",
        "IEX": "IDEX Corporation",
        "IDXX": "Idexx Laboratories",
        "ITW": "Illinois Tool Works",
        "ILMN": "Illumina",
        "INCY": "Incyte",
        "IR": "Ingersoll Rand",
        "INTC": "Intel",
        "ICE": "Intercontinental Exchange",
        "IP": "International Paper",
        "IPG": "The Interpublic Group of Companies",
        "IFF": "International Flavors & Fragrances",
        "INTU": "Intuit",
        "ISRG": "Intuitive Surgical",
        "IVZ": "Invesco",
        "INVH": "Invitation Homes",
        "IQV": "IQVIA",
        "IRM": "Iron Mountain",
        "JBHT": "J.B.','Hunt",
        "JKHY": "Jack Henry & Associates",
        "J": "Jacobs Solutions",
        "JNJ": "Johnson & Johnson",
        "JCI": "Johnson Controls",
        "JPM": "JPMorgan Chase",
        "JNPR": "Juniper Networks",
        "K": "Kellogg's",
        "KDP": "Keurig Dr Pepper",
        "KEY": "KeyCorp",
        "KEYS": "Keysight",
        "KMB": "Kimberly-Clark",
        "KIM": "Kimco Realty",
        "KMI": "Kinder Morgan",
        "KLAC": "KLA Corporation",
        "KHC": "Kraft Heinz",
        "KR": "Kroger",
        "LHX": "L3Harris",
        "LH": "LabCorp",
        "LRCX": "Lam Research",
        "LW": "Lamb Weston",
        "LVS": "Las Vegas Sands",
        "LDOS": "Leidos",
        "LEN": "Lennar",
        "LNC": "Lincoln Financial",
        "LIN": "Linde plc",
        "LYV": "Live Nation Entertainment",
        "LKQ": "LKQ Corporation",
        "LMT": "Lockheed Martin",
        "L": "Loews Corporation",
        "LOW": "Lowe's",
        "LUMN": "Lumen Technologies",
        "LYB": "LyondellBasell",
        "MTB": "M&T Bank",
        "MRO": "Marathon Oil",
        "MPC": "Marathon Petroleum",
        "MKTX": "MarketAxess",
        "MAR": "Marriott International",
        "MMC": "Marsh McLennan",
        "MLM": "Martin Marietta Materials",
        "MAS": "Masco",
        "MA": "Mastercard",
        "MTCH": "Match Group",
        "MKC": "McCormick & Company",
        "MCD": "McDonald's",
        "MCK": "McKesson",
        "MDT": "Medtronic",
        "MRK": "Merck & Co.",
        "META": "Meta Platforms",
        "MET": "MetLife",
        "MTD": "Mettler Toledo",
        "MGM": "MGM Resorts",
        "MCHP": "Microchip Technology",
        "MU": "Micron Technology",
        "MSFT": "Microsoft",
        "MAA": "Mid-America Apartment Communities",
        "MRNA": "Moderna",
        "MHK": "Mohawk Industries",
        "MOH": "Molina Healthcare",
        "TAP": "Molson Coors Beverage Company",
        "MDLZ": "Mondelez International",
        "MPWR": "Monolithic Power Systems",
        "MNST": "Monster Beverage",
        "MCO": "Moody's Corporation",
        "MS": "Morgan Stanley",
        "MOS": "The Mosaic Company",
        "MSI": "Motorola Solutions",
        "MSCI": "MSCI",
        "NDAQ": "Nasdaq, Inc.",
        "NTAP": "NetApp",
        "NFLX": "Netflix",
        "NWL": "Newell Brands",
        "NEM": "Newmont",
        "NWSA": "News Corp (Class A)",
        "NWS": "News Corp (Class B)",
        "NEE": "NextEra Energy",
        "NKE": "Nike, Inc.",
        "NI": "NiSource",
        "NDSN": "Nordson Corporation",
        "NSC": "Norfolk Southern Railway",
        "NTRS": "Northern Trust",
        "NOC": "Northrop Grumman",
        "NCLH": "Norwegian Cruise Line Holdings",
        "NRG": "NRG Energy",
        "NUE": "Nucor",
        "NVDA": "Nvidia",
        "NVR": "NVR, Inc.",
        "NXPI": "NXP Semiconductors",
        "ORLY": "O'Reilly Auto Parts",
        "OXY": "Occidental Petroleum",
        "ODFL": "Old Dominion",
        "OMC": "Omnicom Group",
        "ON": "ON Semiconductor",
        "OKE": "ONEOK",
        "ORCL": "Oracle Corporation",
        "OGN": "Organon & Co.",
        "OTIS": "Otis Worldwide",
        "PCAR": "Paccar",
        "PKG": "Packaging Corporation of America",
        "PARA": "Paramount Global",
        "PH": "Parker Hannifin",
        "PAYX": "Paychex",
        "PAYC": "Paycom",
        "PYPL": "PayPal",
        "PNR": "Pentair",
        "PEP": "PepsiCo",
        "PKI": "PerkinElmer",
        "PFE": "Pfizer",
        "PCG": "PG&E Corporation",
        "PM": "Philip Morris International",
        "PSX": "Phillips 66",
        "PNW": "Pinnacle West",
        "PXD": "Pioneer Natural Resources",
        "PNC": "PNC Financial Services",
        "POOL": "Pool Corporation",
        "PPG": "PPG Industries",
        "PPL": "PPL Corporation",
        "PFG": "Principal Financial Group",
        "PG": "Procter & Gamble",
        "PGR": "Progressive Corporation",
        "PLD": "Prologis",
        "PRU": "Prudential Financial",
        "PEG": "Public Service Enterprise Group",
        "PTC": "PTC",
        "PSA": "Public Storage",
        "PHM": "PulteGroup",
        "QRVO": "Qorvo",
        "PWR": "Quanta Services",
        "QCOM": "Qualcomm",
        "DGX": "Quest Diagnostics",
        "RL": "Ralph Lauren Corporation",
        "RJF": "Raymond James",
        "RTX": "Raytheon Technologies",
        "O": "Realty Income",
        "REG": "Regency Centers",
        "REGN": "Regeneron",
        "RF": "Regions Financial Corporation",
        "RSG": "Republic Services",
        "RMD": "ResMed",
        "RHI": "Robert Half",
        "ROK": "Rockwell Automation",
        "ROL": "Rollins, Inc.",
        "ROP": "Roper Technologies",
        "ROST": "Ross Stores",
        "RCL": "Royal Caribbean Group",
        "SPGI": "S&P Global",
        "CRM": "Salesforce",
        "SBAC": "SBA Communications",
        "SLB": "Schlumberger",
        "STX": "Seagate Technology",
        "SEE": "Sealed Air",
        "SRE": "Sempra Energy",
        "NOW": "ServiceNow",
        "SHW": "Sherwin-Williams",
        "SBNY": "Signature Bank",
        "SPG": "Simon Property Group",
        "SWKS": "Skyworks Solutions",
        "SJM": "The J.M.','Smucker Company",
        "SNA": "Snap-on",
        "SEDG": "SolarEdge",
        "SO": "Southern Company",
        "LUV": "Southwest Airlines",
        "SWK": "Stanley Black & Decker",
        "SBUX": "Starbucks",
        "STT": "State Street Corporation",
        "STLD": "Steel Dynamics",
        "STE": "Steris",
        "SYK": "Stryker Corporation",
        "SIVB": "SVB Financial",
        "SYF": "Synchrony Financial",
        "SNPS": "Synopsys",
        "SYY": "Sysco",
        "TMUS": "T-Mobile US",
        "TROW": "T.','Rowe Price",
        "TTWO": "Take-Two Interactive",
        "TPR": "Tapestry, Inc.",
        "TRGP": "Targa Resources",
        "TGT": "Target Corporation",
        "TEL": "TE Connectivity",
        "TDY": "Teledyne Technologies",
        "TFX": "Teleflex",
        "TER": "Teradyne",
        "TSLA": "Tesla, Inc.",
        "TXN": "Texas Instruments",
        "TXT": "Textron",
        "TMO": "Thermo Fisher Scientific",
        "TJX": "TJX Companies",
        "TSCO": "Tractor Supply",
        "TT": "Trane Technologies",
        "TDG": "TransDigm Group",
        "TRV": "The Travelers Companies",
        "TRMB": "Trimble Inc.",
        "TFC": "Truist",
        "TYL": "Tyler Technologies",
        "TSN": "Tyson Foods",
        "USB": "U.S.','Bank",
        "UDR": "UDR, Inc.",
        "ULTA": "Ulta Beauty",
        "UNP": "Union Pacific Corporation",
        "UAL": "United Airlines Holdings",
        "UPS": "United Parcel Service",
        "URI": "United Rentals",
        "UNH": "UnitedHealth Group",
        "UHS": "Universal Health Services",
        "VLO": "Valero Energy",
        "VTR": "Ventas",
        "VRSN": "Verisign",
        "VRSK": "Verisk",
        "VZ": "Verizon",
        "VRTX": "Vertex Pharmaceuticals",
        "VFC": "VF Corporation",
        "VTRS": "Viatris",
        "VICI": "Vici Properties",
        "V": "Visa Inc.",
        "VNO": "Vornado Realty Trust",
        "VMC": "Vulcan Materials Company",
        "WAB": "Wabtec",
        "WBA": "Walgreens Boots Alliance",
        "WMT": "Walmart",
        "WBD": "Warner Bros.','Discovery",
        "WM": "Waste Management",
        "WAT": "Waters Corporation",
        "WEC": "WEC Energy Group",
        "WFC": "Wells Fargo",
        "WELL": "Welltower",
        "WST": "West Pharmaceutical Services",
        "WDC": "Western Digital",
        "WRK": "WestRock",
        "WY": "Weyerhaeuser",
        "WHR": "Whirlpool Corporation",
        "WMB": "Williams Companies",
        "WTW": "Willis Towers Watson",
        "GWW": "W.','W.','Grainger",
        "WYNN": "Wynn Resorts",
        "XEL": "Xcel Energy",
        "XYL": "Xylem Inc.",
        "YUM": "Yum! Brands",
        "ZBRA": "Zebra Technologies",
        "ZBH": "Zimmer Biomet",
        "ZION": "Zions Bancorporation",
        "ZTS": "Zoetis"
    };

    const companies = Object.entries(sp500);

    const loremIpsum = [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'Etiam eu dui eu risus pretium interdum non et sem.',
        'Quisque tempor tellus vitae sapien efficitur facilisis.',
        'Morbi dapibus porttitor enim sed porttitor.',
        'Phasellus et nunc vel massa aliquam faucibus eget ac ipsum.',
        'Praesent efficitur nibh semper arcu consequat, ac consequat sem ullamcorper.',
        'Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.',
        'Duis vitae dolor in ipsum rutrum egestas eget et libero.',
        'Fusce elit diam, gravida at laoreet sit amet, suscipit sit amet nisl.',
        'Sed molestie, orci quis dapibus condimentum, quam nunc luctus enim, in interdum ligula purus ac urna.',
        'Duis in felis eget nisl interdum luctus.',
        'Etiam quam mi, porta eu feugiat ac, pulvinar vel nunc.', 'Nunc aliquet velit orci, vitae blandit nisl suscipit eget.',
        'Interdum et malesuada fames ac ante ipsum primis in faucibus.',
        'Maecenas mattis accumsan neque, id pharetra massa pharetra eget.',
        'Pellentesque eu tellus sodales, pretium erat sed, laoreet augue.',
        'Nam ornare pulvinar massa id consectetur.', 'Fusce malesuada auctor nulla id laoreet.',
        'Etiam molestie vestibulum ligula vel vulputate.',
        'Aenean vitae euismod neque.',
        'Phasellus commodo gravida eleifend.',
        'Curabitur consectetur vulputate lobortis.',
        'In pellentesque faucibus nulla, sed molestie dui mattis et.',
        'Donec ultricies massa sed scelerisque maximus.',
        'Nunc pellentesque turpis dolor, at iaculis risus sagittis vel.',
        'Aliquam pellentesque gravida dui, quis blandit urna maximus vel.',
        'Ut felis dui, varius ac lacinia in, finibus et nulla.',
        'Nulla sodales finibus molestie.',
        'Aliquam nec dolor posuere, auctor odio id, molestie mi.',
        'Quisque quis erat egestas, porta risus ut, cursus purus.',
        'Nunc vitae molestie diam, nec maximus orci.',
        'Vestibulum nunc tellus, condimentum ut mi eu, ornare laoreet orci.',
        'Praesent eleifend auctor lorem, ac tincidunt tortor ornare vitae.',
        'Phasellus ligula nibh, lobortis a augue id, fringilla tempus enim.',
        'Mauris tristique pretium justo, vitae tempus erat.',
        'In finibus, risus ut porttitor dignissim, augue nisi semper enim, a vulputate nisl erat id ipsum.',
        'Morbi et nibh id erat pretium aliquam.',
        'Vestibulum ultrices eros et efficitur bibendum.',
        'Vivamus ut mi vestibulum, vestibulum odio at, suscipit orci.',
        'Ut luctus dui sit amet rutrum accumsan.',
        'In maximus, lorem sed malesuada eleifend, ex mauris commodo nulla, id varius dui mi eu elit.',
        'Quisque enim neque, scelerisque at eleifend vitae, tincidunt non enim.',
        'Donec vel fermentum enim, id venenatis tortor.',
        'Curabitur lorem neque, convallis et sagittis sed, blandit id arcu.',
        'Aliquam pulvinar vulputate neque eu pretium.', 'Maecenas eget feugiat est.',
        'Morbi tincidunt dapibus massa vel consectetur.',
        'Etiam risus metus, faucibus et sollicitudin vitae, pretium et odio.',
        'Vivamus sodales mauris molestie viverra auctor.',
        'In tempor ligula eget sem accumsan tincidunt.',
        'In hac habitasse platea dictumst.',
        'Phasellus rutrum enim ante, at rutrum leo lobortis id.',
        'Aenean nec velit nec nisi accumsan elementum vel eu lectus.',
        'Mauris turpis dui, gravida vitae purus in, pellentesque ultrices nunc.'
    ];

    // Makes 1000 trades to seed the database 
    for (let index = 0; index < 1000; index++) {
        // Get random company
        const company = companies[getRndInteger(0, companies.length - 1)];
        const [ticker, name] = company;
        const amount = getRndInteger(0, 100000) / 100;
        const shares = getRndInteger(-100, 100);
        const newTrade = {
            amount,
            shares,
            ticker,
            company: name,
            user_id: '639cc46151da8d964f60390b',
            date: new Date(),
            note: loremIpsum[getRndInteger(0, loremIpsum.length - 1)]
        };

        // Find existing company document, else create it
        const result = await Models.Company.findOneAndUpdate(
            { ticker: newTrade.ticker },
            { $setOnInsert: { name: newTrade.company, ticker: newTrade.ticker } },
            { upsert: true, new: true }
        );

        // Store company document id in the new trade
        newTrade.company_id = result._id;

        Models.Trade.create(newTrade)
    };
};

// RUN ONLY ONCE TO SEED THE DATABASE
// seedDatabase();

// Gets trades for the user, the toJSON response will be formatted as defined in company and trade schemas
router.get('/', async function (req, res, next) {
    return res.send(
        await req.context.models.Trade.find()
            .sort({ 'company_id': 1 })
            .populate('company_id')
            .sort({ 'company_id.ticker': 1, 'date': 1 })
    );
});

// Post new trade for user
router.post('/', async function (req, res, next) {
    const newTrade = req.body;

    // Find existing company document, else create it
    const result = await req.context.models.Company.findOneAndUpdate(
        { _id: newTrade.company_id },
        { $setOnInsert: { name: newTrade.company, ticker: newTrade.ticker } },
        { upsert: true, new: true }
    );

    // Store company document id in the new trade
    newTrade.company_id = result._id;

    // Save the new trade and return it
    return res.send(await req.context.models.Trade.create(newTrade));
});

export default router;