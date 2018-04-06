// ----- consts ----- //

const SIGNATURE_TEXT_FOR_STARTER_TABLE = 'Single-Family Homes Client Detail Report';
const SIGNATURE_TEXT_FOR_HEADER_TABLE = 'MLS#';
const SIGNATURE_TEXT_FOR_SELL_TABLE = 'Pending Date';
const SIGNATURE_TEXT_FOR_DETAILS_TABLE = 'Single-Family Homes';


// ----- top-level functions ----- //

const findAllTablesSignifyingStartOfAHome = () => [...document.querySelectorAll('table')].filter(t => t.innerText.trim() === SIGNATURE_TEXT_FOR_STARTER_TABLE);

const groupTablesByHome = starterTableOfHome => {
	const tables = [];
	let current = starterTableOfHome;
	do {
		tables.push(current);
		current = current.nextElementSibling;
	} while (current && current.tagName === 'TABLE');
	return tables;
};

const domToCsv = tablesForAHome => {
	const headerTable = findHeaderTable(tablesForAHome);
	const sellTable = findSellTable(tablesForAHome);
	const detailsTable = findDetailsTable(tablesForAHome);

	const address = getAddress(headerTable);
	const type = 'Single family';
	const listingPrice = getListingPrice(headerTable);
	const sellingPrice = getSellingPrice(sellTable);
	const daysOnMarket = getDaysOnMarket(sellTable);
	const numBeds = getNumBeds(detailsTable);
	const numBaths = getNumBaths(detailsTable);
	const numParkingSpots = getNumParkingSpots(detailsTable);

	return `${address}	${type}	${listingPrice}	${sellingPrice}	${daysOnMarket}	${numBeds}	${numBaths}	${numParkingSpots}`;
};


// ----- find* ----- //

const findHeaderTable = tablesForAHome => tablesForAHome.find(t => [...t.querySelectorAll('td b')].some(b => b.innerText.trim().startsWith(SIGNATURE_TEXT_FOR_HEADER_TABLE)));

const findSellTable = tablesForAHome => tablesForAHome.find(t => [...t.querySelectorAll('td b')].some(b => b.innerText.trim().startsWith(SIGNATURE_TEXT_FOR_SELL_TABLE)));

const findDetailsTable = tablesForAHome => tablesForAHome.find(t => [...t.querySelectorAll('td b')].some(b => b.innerText.trim().startsWith(SIGNATURE_TEXT_FOR_DETAILS_TABLE)));


// ----- get* ----- //

const getAddress = headerTable => headerTable.querySelectorAll('td b')[2].innerText.trim();

const getListingPrice = headerTable => {
	const raw = headerTable.querySelectorAll('td b')[4].innerText;
	return raw.replace('$', '').trim();
};

const getSellingPrice = sellTable => sellTable.querySelectorAll('td b')[5].innerText.trim();

const getDaysOnMarket = sellTable => sellTable.querySelectorAll('td b')[7].innerText.trim();

const getNumBeds = detailsTable => detailsTable.querySelectorAll('table table table')[3].querySelectorAll('td')[1].innerText.trim();

const getNumBaths = detailsTable => detailsTable.querySelectorAll('table table table')[3].querySelectorAll('td')[3].innerText.trim();

const getNumParkingSpots = detailsTable => detailsTable.querySelectorAll('table table table')[3].querySelectorAll('td')[5].innerText.trim();


// ----- Main ----- //

const starterTables = findAllTablesSignifyingStartOfAHome();
const tablesByHome = starterTables.map(groupTablesByHome);
const csvs = tablesByHome.map(domToCsv);
const header = 'Address 	Type 	Listing Price 	Selling Price 	Days on Market 	Beds 	Baths 	Parking Spots';
csvs.unshift(header);
console.log(csvs.join('\n'));
