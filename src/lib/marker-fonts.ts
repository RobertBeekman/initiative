import {
    Bitcount_Prop_Single,
    Black_Ops_One,
    Caveat,
    Chewy,
    Domine,
    Edu_NSW_ACT_Cursive,
    Finger_Paint,
    Geist_Pixel,
    Jim_Nightshade,
    Josefin_Sans,
    Libertinus_Math,
    Montserrat,
    Playwrite_DE_SAS_Guides,
    Quicksand,
} from "next/font/google";

const domine = Domine({subsets: ["latin"], weight: "400"});
const fingerPaint = Finger_Paint({subsets: ["latin"], weight: "400"});
const chewy = Chewy({subsets: ["latin"], weight: "400"});
const bitcountPropSingle = Bitcount_Prop_Single({subsets: ["latin"], weight: "400"});
const blackOpsOne = Black_Ops_One({subsets: ["latin"], weight: "400"});
const caveat = Caveat({subsets: ["latin"], weight: "400"});
const eduNSWACTCursive = Edu_NSW_ACT_Cursive({subsets: ["latin"], weight: "400"});
const geistPixel = Geist_Pixel({subsets: ["latin"], weight: "400"});
const jimNightshade = Jim_Nightshade({subsets: ["latin"], weight: "400"});
const josefinSans = Josefin_Sans({subsets: ["latin"], weight: "100"});
// Libertinus Math and Playwrite guide fonts have no subset metadata; `subsets` must be omitted for these.
const libertinusMath = Libertinus_Math({weight: "400"});
const montserrat = Montserrat({subsets: ["latin"], weight: "100"});
const playwriteDESASGuides = Playwrite_DE_SAS_Guides({weight: "400"});
const quicksand = Quicksand({subsets: ["latin"], weight: "300"});

export type MarkerFontId =
    | "domine"
    | "fingerPaint"
    | "chewy"
    | "bitcountPropSingle"
    | "blackOpsOne"
    | "caveat"
    | "eduNSWACTCursive"
    | "geistPixel"
    | "jimNightshade"
    | "josefinSans"
    | "libertinusMath"
    | "montserrat"
    | "playwriteDESASGuides"
    | "quicksand";

export const MARKER_FONTS: {id: MarkerFontId; label: string; className: string}[] = [
    {id: "domine", label: "Domine", className: domine.className},
    {id: "fingerPaint", label: "Finger Paint", className: fingerPaint.className},
    {id: "chewy", label: "Chewy", className: chewy.className},
    {id: "bitcountPropSingle", label: "Bitcount Prop Single", className: bitcountPropSingle.className},
    {id: "blackOpsOne", label: "Black Ops One", className: blackOpsOne.className},
    {id: "caveat", label: "Caveat", className: caveat.className},
    {id: "eduNSWACTCursive", label: "Edu NSW ACT Cursive", className: eduNSWACTCursive.className},
    {id: "geistPixel", label: "Geist Pixel", className: geistPixel.className},
    {id: "jimNightshade", label: "Jim Nightshade", className: jimNightshade.className},
    {id: "josefinSans", label: "Josefin Sans", className: josefinSans.className},
    {id: "libertinusMath", label: "Libertinus Math", className: libertinusMath.className},
    {id: "montserrat", label: "Montserrat", className: montserrat.className},
    {id: "playwriteDESASGuides", label: "Playwrite DE SAS Guides", className: playwriteDESASGuides.className},
    {id: "quicksand", label: "Quicksand", className: quicksand.className},
];
