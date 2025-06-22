import type { Praesidium, Revier } from "../stores/wizard";

// Mock-Daten für Präsidien
export const mockPraesidien: Praesidium[] = [
	{
		id: "1",
		name: "Polizeipräsidium München",
		coordinates: [11.582, 48.1351],
		childReviere: [
			"revier1",
			"revier2",
			"revier3",
			"revier4",
			"revier5",
			"revier29",
			"revier30",
			"revier31",
			"revier32",
			"revier33",
		],
	},
	{
		id: "2",
		name: "Polizeipräsidium Hamburg",
		coordinates: [9.9937, 53.5511],
		childReviere: ["revier6", "revier7", "revier8", "revier34", "revier35", "revier36", "revier37"],
	},
	{
		id: "3",
		name: "Polizeipräsidium Berlin",
		coordinates: [13.405, 52.52],
		childReviere: [
			"revier9",
			"revier10",
			"revier11",
			"revier12",
			"revier38",
			"revier39",
			"revier40",
			"revier41",
			"revier42",
		],
	},
	{
		id: "4",
		name: "Polizeipräsidium Köln",
		coordinates: [6.9531, 50.9375],
		childReviere: ["revier13", "revier14", "revier15", "revier43", "revier44", "revier45"],
	},
	{
		id: "5",
		name: "Polizeipräsidium Frankfurt am Main",
		coordinates: [8.6821, 50.1109],
		childReviere: [
			"revier16",
			"revier17",
			"revier18",
			"revier19",
			"revier46",
			"revier47",
			"revier48",
			"revier49",
		],
	},
	{
		id: "6",
		name: "Polizeipräsidium Stuttgart",
		coordinates: [9.1829, 48.7758],
		childReviere: ["revier20", "revier21", "revier22", "revier50", "revier51", "revier52"],
	},
	{
		id: "7",
		name: "Polizeipräsidium Düsseldorf",
		coordinates: [6.7735, 51.2277],
		childReviere: ["revier23", "revier24", "revier25", "revier53", "revier54", "revier55"],
	},
	{
		id: "8",
		name: "Polizeipräsidium Leipzig",
		coordinates: [12.3731, 51.3397],
		childReviere: ["revier26", "revier27", "revier28", "revier56", "revier57", "revier58"],
	},
];

// Mock-Daten für Reviere
export const mockReviere: Revier[] = [
	// München Reviere
	{
		id: "revier1",
		name: "Revier München-Mitte",
		praesidiumId: "1",
		geometry: null,
		contact: {
			phone: "+49 89 1234-5678",
			email: "muenchen-mitte@polizei.bayern.de",
			address: "Ettstraße 2, 80331 München",
		},
	},
	{
		id: "revier2",
		name: "Revier München-Schwabing",
		praesidiumId: "1",
		geometry: null,
		contact: {
			phone: "+49 89 1234-5679",
			email: "muenchen-schwabing@polizei.bayern.de",
			address: "Leopoldstraße 117, 80804 München",
		},
	},
	{
		id: "revier3",
		name: "Revier München-Maxvorstadt",
		praesidiumId: "1",
		geometry: null,
		contact: {
			phone: "+49 89 1234-5680",
			email: "muenchen-maxvorstadt@polizei.bayern.de",
			address: "Amalienstraße 36, 80333 München",
		},
	},
	{
		id: "revier4",
		name: "Revier München-Haidhausen",
		praesidiumId: "1",
		geometry: null,
		contact: {
			phone: "+49 89 1234-5681",
			email: "muenchen-haidhausen@polizei.bayern.de",
			address: "Rosenheimer Straße 1, 81667 München",
		},
	},
	{
		id: "revier5",
		name: "Revier München-Au",
		praesidiumId: "1",
		geometry: null,
		contact: {
			phone: "+49 89 1234-5682",
			email: "muenchen-au@polizei.bayern.de",
			address: "Auerfeldstraße 5, 81541 München",
		},
	},

	// Hamburg Reviere
	{
		id: "revier6",
		name: "Revier Hamburg-Mitte",
		praesidiumId: "2",
		geometry: null,
		contact: {
			phone: "+49 40 1234-5678",
			email: "hamburg-mitte@polizei.hamburg.de",
			address: "Kirchenallee 46, 20099 Hamburg",
		},
	},
	{
		id: "revier7",
		name: "Revier Hamburg-Altona",
		praesidiumId: "2",
		geometry: null,
		contact: {
			phone: "+49 40 1234-5679",
			email: "hamburg-altona@polizei.hamburg.de",
			address: "Max-Brauer-Allee 134, 22765 Hamburg",
		},
	},
	{
		id: "revier8",
		name: "Revier Hamburg-Harburg",
		praesidiumId: "2",
		geometry: null,
		contact: {
			phone: "+49 40 1234-5680",
			email: "hamburg-harburg@polizei.hamburg.de",
			address: "Harburger Rathausstraße 2, 21073 Hamburg",
		},
	},

	// Berlin Reviere
	{
		id: "revier9",
		name: "Revier Berlin-Mitte",
		praesidiumId: "3",
		geometry: null,
		contact: {
			phone: "+49 30 1234-5678",
			email: "berlin-mitte@polizei.berlin.de",
			address: "Keibelstraße 35, 10178 Berlin",
		},
	},
	{
		id: "revier10",
		name: "Revier Berlin-Kreuzberg",
		praesidiumId: "3",
		geometry: null,
		contact: {
			phone: "+49 30 1234-5679",
			email: "berlin-kreuzberg@polizei.berlin.de",
			address: "Yorckstraße 4-11, 10965 Berlin",
		},
	},
	{
		id: "revier11",
		name: "Revier Berlin-Charlottenburg",
		praesidiumId: "3",
		geometry: null,
		contact: {
			phone: "+49 30 1234-5680",
			email: "berlin-charlottenburg@polizei.berlin.de",
			address: "Otto-Suhr-Allee 100, 10585 Berlin",
		},
	},
	{
		id: "revier12",
		name: "Revier Berlin-Spandau",
		praesidiumId: "3",
		geometry: null,
		contact: {
			phone: "+49 30 1234-5681",
			email: "berlin-spandau@polizei.berlin.de",
			address: "Carl-Schurz-Straße 2-6, 13597 Berlin",
		},
	},

	// Köln Reviere
	{
		id: "revier13",
		name: "Revier Köln-Innenstadt",
		praesidiumId: "4",
		geometry: null,
		contact: {
			phone: "+49 221 1234-5678",
			email: "koeln-innenstadt@polizei.nrw.de",
			address: "Ebertplatz 1, 50668 Köln",
		},
	},
	{
		id: "revier14",
		name: "Revier Köln-Ehrenfeld",
		praesidiumId: "4",
		geometry: null,
		contact: {
			phone: "+49 221 1234-5679",
			email: "koeln-ehrenfeld@polizei.nrw.de",
			address: "Venloer Straße 419, 50825 Köln",
		},
	},
	{
		id: "revier15",
		name: "Revier Köln-Nippes",
		praesidiumId: "4",
		geometry: null,
		contact: {
			phone: "+49 221 1234-5680",
			email: "koeln-nippes@polizei.nrw.de",
			address: "Neusser Straße 450, 50733 Köln",
		},
	},

	// Frankfurt Reviere
	{
		id: "revier16",
		name: "Revier Frankfurt-Innenstadt",
		praesidiumId: "5",
		geometry: null,
		contact: {
			phone: "+49 69 1234-5678",
			email: "frankfurt-innenstadt@polizei.hessen.de",
			address: "Adickesallee 70, 60322 Frankfurt am Main",
		},
	},
	{
		id: "revier17",
		name: "Revier Frankfurt-Sachsenhausen",
		praesidiumId: "5",
		geometry: null,
		contact: {
			phone: "+49 69 1234-5679",
			email: "frankfurt-sachsenhausen@polizei.hessen.de",
			address: "Textorstraße 16, 60594 Frankfurt am Main",
		},
	},
	{
		id: "revier18",
		name: "Revier Frankfurt-Bornheim",
		praesidiumId: "5",
		geometry: null,
		contact: {
			phone: "+49 69 1234-5680",
			email: "frankfurt-bornheim@polizei.hessen.de",
			address: "Berger Straße 147, 60385 Frankfurt am Main",
		},
	},
	{
		id: "revier19",
		name: "Revier Frankfurt-Nordend",
		praesidiumId: "5",
		geometry: null,
		contact: {
			phone: "+49 69 1234-5681",
			email: "frankfurt-nordend@polizei.hessen.de",
			address: "Eckenheimer Landstraße 95, 60318 Frankfurt am Main",
		},
	},

	// Stuttgart Reviere
	{
		id: "revier20",
		name: "Revier Stuttgart-Mitte",
		praesidiumId: "6",
		geometry: null,
		contact: {
			phone: "+49 711 1234-5678",
			email: "stuttgart-mitte@polizei.baden-wuerttemberg.de",
			address: "Rosenstraße 36, 70182 Stuttgart",
		},
	},
	{
		id: "revier21",
		name: "Revier Stuttgart-Bad Cannstatt",
		praesidiumId: "6",
		geometry: null,
		contact: {
			phone: "+49 711 1234-5679",
			email: "stuttgart-bad-cannstatt@polizei.baden-wuerttemberg.de",
			address: "Marktstraße 71, 70372 Stuttgart",
		},
	},
	{
		id: "revier22",
		name: "Revier Stuttgart-Degerloch",
		praesidiumId: "6",
		geometry: null,
		contact: {
			phone: "+49 711 1234-5680",
			email: "stuttgart-degerloch@polizei.baden-wuerttemberg.de",
			address: "Filderhauptstraße 155, 70599 Stuttgart",
		},
	},

	// Düsseldorf Reviere
	{
		id: "revier23",
		name: "Revier Düsseldorf-Innenstadt",
		praesidiumId: "7",
		geometry: null,
		contact: {
			phone: "+49 211 1234-5678",
			email: "duesseldorf-innenstadt@polizei.nrw.de",
			address: "Jürgensplatz 1, 40219 Düsseldorf",
		},
	},
	{
		id: "revier24",
		name: "Revier Düsseldorf-Bilk",
		praesidiumId: "7",
		geometry: null,
		contact: {
			phone: "+49 211 1234-5679",
			email: "duesseldorf-bilk@polizei.nrw.de",
			address: "Bilker Allee 128, 40215 Düsseldorf",
		},
	},
	{
		id: "revier25",
		name: "Revier Düsseldorf-Oberkassel",
		praesidiumId: "7",
		geometry: null,
		contact: {
			phone: "+49 211 1234-5680",
			email: "duesseldorf-oberkassel@polizei.nrw.de",
			address: "Luegallee 85, 40549 Düsseldorf",
		},
	},

	// Leipzig Reviere
	{
		id: "revier26",
		name: "Revier Leipzig-Zentrum",
		praesidiumId: "8",
		geometry: null,
		contact: {
			phone: "+49 341 1234-5678",
			email: "leipzig-zentrum@polizei.sachsen.de",
			address: "Dittrichring 24, 04109 Leipzig",
		},
	},
	{
		id: "revier27",
		name: "Revier Leipzig-Plagwitz",
		praesidiumId: "8",
		geometry: null,
		contact: {
			phone: "+49 341 1234-5679",
			email: "leipzig-plagwitz@polizei.sachsen.de",
			address: "Karl-Heine-Straße 99, 04229 Leipzig",
		},
	},
	{
		id: "revier28",
		name: "Revier Leipzig-Grünau",
		praesidiumId: "8",
		geometry: null,
		contact: {
			phone: "+49 341 1234-5680",
			email: "leipzig-gruenau@polizei.sachsen.de",
			address: "Stuttgarter Allee 9, 04209 Leipzig",
		},
	},

	// Erweiterte München Reviere
	{
		id: "revier29",
		name: "Revier München-Pasing",
		praesidiumId: "1",
		geometry: null,
		contact: {
			phone: "+49 89 1234-5683",
			email: "muenchen-pasing@polizei.bayern.de",
			address: "Pasinger Bahnhofsplatz 1, 81241 München",
		},
	},
	{
		id: "revier30",
		name: "Revier München-Giesing",
		praesidiumId: "1",
		geometry: null,
		contact: {
			phone: "+49 89 1234-5684",
			email: "muenchen-giesing@polizei.bayern.de",
			address: "Giesinger Bahnhofplatz 1, 81539 München",
		},
	},
	{
		id: "revier31",
		name: "Revier München-Moosach",
		praesidiumId: "1",
		geometry: null,
		contact: {
			phone: "+49 89 1234-5685",
			email: "muenchen-moosach@polizei.bayern.de",
			address: "Moosacher Straße 1, 80992 München",
		},
	},
	{
		id: "revier32",
		name: "Revier München-Neuhausen",
		praesidiumId: "1",
		geometry: null,
		contact: {
			phone: "+49 89 1234-5686",
			email: "muenchen-neuhausen@polizei.bayern.de",
			address: "Nymphenburger Straße 1, 80636 München",
		},
	},
	{
		id: "revier33",
		name: "Revier München-Berg am Laim",
		praesidiumId: "1",
		geometry: null,
		contact: {
			phone: "+49 89 1234-5687",
			email: "muenchen-berg-am-laim@polizei.bayern.de",
			address: "Berg am Laimer Straße 1, 81673 München",
		},
	},

	// Erweiterte Hamburg Reviere
	{
		id: "revier34",
		name: "Revier Hamburg-Bergedorf",
		praesidiumId: "2",
		geometry: null,
		contact: {
			phone: "+49 40 1234-5681",
			email: "hamburg-bergedorf@polizei.hamburg.de",
			address: "Bergedorfer Straße 1, 21029 Hamburg",
		},
	},
	{
		id: "revier35",
		name: "Revier Hamburg-Wandsbek",
		praesidiumId: "2",
		geometry: null,
		contact: {
			phone: "+49 40 1234-5682",
			email: "hamburg-wandsbek@polizei.hamburg.de",
			address: "Wandsbeker Marktstraße 1, 22041 Hamburg",
		},
	},
	{
		id: "revier36",
		name: "Revier Hamburg-Nord",
		praesidiumId: "2",
		geometry: null,
		contact: {
			phone: "+49 40 1234-5683",
			email: "hamburg-nord@polizei.hamburg.de",
			address: "Uhlenhorster Weg 1, 22087 Hamburg",
		},
	},
	{
		id: "revier37",
		name: "Revier Hamburg-Eimsbüttel",
		praesidiumId: "2",
		geometry: null,
		contact: {
			phone: "+49 40 1234-5684",
			email: "hamburg-eimsbuettel@polizei.hamburg.de",
			address: "Eimsbütteler Marktplatz 1, 20259 Hamburg",
		},
	},

	// Erweiterte Berlin Reviere
	{
		id: "revier38",
		name: "Revier Berlin-Neukölln",
		praesidiumId: "3",
		geometry: null,
		contact: {
			phone: "+49 30 1234-5682",
			email: "berlin-neukoelln@polizei.berlin.de",
			address: "Karl-Marx-Straße 1, 12043 Berlin",
		},
	},
	{
		id: "revier39",
		name: "Revier Berlin-Tempelhof",
		praesidiumId: "3",
		geometry: null,
		contact: {
			phone: "+49 30 1234-5683",
			email: "berlin-tempelhof@polizei.berlin.de",
			address: "Tempelhofer Damm 1, 12101 Berlin",
		},
	},
	{
		id: "revier40",
		name: "Revier Berlin-Steglitz",
		praesidiumId: "3",
		geometry: null,
		contact: {
			phone: "+49 30 1234-5684",
			email: "berlin-steglitz@polizei.berlin.de",
			address: "Schloßstraße 1, 12163 Berlin",
		},
	},
	{
		id: "revier41",
		name: "Revier Berlin-Wilmersdorf",
		praesidiumId: "3",
		geometry: null,
		contact: {
			phone: "+49 30 1234-5685",
			email: "berlin-wilmersdorf@polizei.berlin.de",
			address: "Brandenburgische Straße 1, 10713 Berlin",
		},
	},
	{
		id: "revier42",
		name: "Revier Berlin-Reinickendorf",
		praesidiumId: "3",
		geometry: null,
		contact: {
			phone: "+49 30 1234-5686",
			email: "berlin-reinickendorf@polizei.berlin.de",
			address: "Alt-Reinickendorf 1, 13407 Berlin",
		},
	},

	// Erweiterte Köln Reviere
	{
		id: "revier43",
		name: "Revier Köln-Lindenthal",
		praesidiumId: "4",
		geometry: null,
		contact: {
			phone: "+49 221 1234-5681",
			email: "koeln-lindenthal@polizei.nrw.de",
			address: "Aachener Straße 1, 50931 Köln",
		},
	},
	{
		id: "revier44",
		name: "Revier Köln-Buchheim",
		praesidiumId: "4",
		geometry: null,
		contact: {
			phone: "+49 221 1234-5682",
			email: "koeln-buchheim@polizei.nrw.de",
			address: "Buchheimer Straße 1, 51063 Köln",
		},
	},
	{
		id: "revier45",
		name: "Revier Köln-Mülheim",
		praesidiumId: "4",
		geometry: null,
		contact: {
			phone: "+49 221 1234-5683",
			email: "koeln-muelheim@polizei.nrw.de",
			address: "Mülheimer Freiheit 1, 51063 Köln",
		},
	},

	// Erweiterte Frankfurt Reviere
	{
		id: "revier46",
		name: "Revier Frankfurt-Westend",
		praesidiumId: "5",
		geometry: null,
		contact: {
			phone: "+49 69 1234-5682",
			email: "frankfurt-westend@polizei.hessen.de",
			address: "Westendstraße 1, 60325 Frankfurt am Main",
		},
	},
	{
		id: "revier47",
		name: "Revier Frankfurt-Bockenheim",
		praesidiumId: "5",
		geometry: null,
		contact: {
			phone: "+49 69 1234-5683",
			email: "frankfurt-bockenheim@polizei.hessen.de",
			address: "Leipziger Straße 1, 60487 Frankfurt am Main",
		},
	},
	{
		id: "revier48",
		name: "Revier Frankfurt-Gallus",
		praesidiumId: "5",
		geometry: null,
		contact: {
			phone: "+49 69 1234-5684",
			email: "frankfurt-gallus@polizei.hessen.de",
			address: "Galluswarte 1, 60326 Frankfurt am Main",
		},
	},
	{
		id: "revier49",
		name: "Revier Frankfurt-Höchst",
		praesidiumId: "5",
		geometry: null,
		contact: {
			phone: "+49 69 1234-5685",
			email: "frankfurt-hoechst@polizei.hessen.de",
			address: "Höchster Markt 1, 65929 Frankfurt am Main",
		},
	},

	// Erweiterte Stuttgart Reviere
	{
		id: "revier50",
		name: "Revier Stuttgart-Vaihingen",
		praesidiumId: "6",
		geometry: null,
		contact: {
			phone: "+49 711 1234-5681",
			email: "stuttgart-vaihingen@polizei.baden-wuerttemberg.de",
			address: "Vaihinger Markt 1, 70563 Stuttgart",
		},
	},
	{
		id: "revier51",
		name: "Revier Stuttgart-Zuffenhausen",
		praesidiumId: "6",
		geometry: null,
		contact: {
			phone: "+49 711 1234-5682",
			email: "stuttgart-zuffenhausen@polizei.baden-wuerttemberg.de",
			address: "Zuffenhauser Markt 1, 70435 Stuttgart",
		},
	},
	{
		id: "revier52",
		name: "Revier Stuttgart-Feuerbach",
		praesidiumId: "6",
		geometry: null,
		contact: {
			phone: "+49 711 1234-5683",
			email: "stuttgart-feuerbach@polizei.baden-wuerttemberg.de",
			address: "Feuerbacher Markt 1, 70469 Stuttgart",
		},
	},

	// Erweiterte Düsseldorf Reviere
	{
		id: "revier53",
		name: "Revier Düsseldorf-Flingern",
		praesidiumId: "7",
		geometry: null,
		contact: {
			phone: "+49 211 1234-5681",
			email: "duesseldorf-flingern@polizei.nrw.de",
			address: "Flinger Straße 1, 40213 Düsseldorf",
		},
	},
	{
		id: "revier54",
		name: "Revier Düsseldorf-Derendorf",
		praesidiumId: "7",
		geometry: null,
		contact: {
			phone: "+49 211 1234-5682",
			email: "duesseldorf-derendorf@polizei.nrw.de",
			address: "Derendorfer Straße 1, 40474 Düsseldorf",
		},
	},
	{
		id: "revier55",
		name: "Revier Düsseldorf-Gerresheim",
		praesidiumId: "7",
		geometry: null,
		contact: {
			phone: "+49 211 1234-5683",
			email: "duesseldorf-gerresheim@polizei.nrw.de",
			address: "Gerresheimer Straße 1, 40625 Düsseldorf",
		},
	},

	// Erweiterte Leipzig Reviere
	{
		id: "revier56",
		name: "Revier Leipzig-Connewitz",
		praesidiumId: "8",
		geometry: null,
		contact: {
			phone: "+49 341 1234-5681",
			email: "leipzig-connewitz@polizei.sachsen.de",
			address: "Connewitzer Straße 1, 04277 Leipzig",
		},
	},
	{
		id: "revier57",
		name: "Revier Leipzig-Lindenau",
		praesidiumId: "8",
		geometry: null,
		contact: {
			phone: "+49 341 1234-5682",
			email: "leipzig-lindenau@polizei.sachsen.de",
			address: "Lindenauer Markt 1, 04177 Leipzig",
		},
	},
	{
		id: "revier58",
		name: "Revier Leipzig-Gohlis",
		praesidiumId: "8",
		geometry: null,
		contact: {
			phone: "+49 341 1234-5683",
			email: "leipzig-gohlis@polizei.sachsen.de",
			address: "Gohliser Straße 1, 04155 Leipzig",
		},
	},
];

// Helper-Funktionen
export function getReviereByPraesidiumId(praesidiumId: string): Revier[] {
	return mockReviere.filter((revier) => revier.praesidiumId === praesidiumId);
}

export function searchPraesidien(query: string): Praesidium[] {
	const lowerQuery = query.toLowerCase();
	return mockPraesidien.filter((praesidium) => praesidium.name.toLowerCase().includes(lowerQuery));
}

export function getPraesidiumById(id: string): Praesidium | undefined {
	return mockPraesidien.find((praesidium) => praesidium.id === id);
}

export function getRevierById(id: string): Revier | undefined {
	return mockReviere.find((revier) => revier.id === id);
}
