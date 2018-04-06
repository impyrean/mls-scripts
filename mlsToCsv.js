const SIGNATURE_TEXT_FOR_STARTER_TABLE = 'Single-Family Homes Client Detail Report';
const SIGNATURE_TEXT_FOR_HEADER_TABLE = 'MLS#';
const SIGNATURE_TEXT_FOR_SELL_TABLE = 'Pending Date';

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

	const address = getAddress(headerTable);
	const type = 'Single family';
	const listingPrice = getListingPrice(headerTable);
	const sellingPrice = getSellingPrice(sellTable);
	const daysOnMarket = getDaysOnMarket(sellTable);

	return `${address};${type};${listingPrice};${sellingPrice};${daysOnMarket}`;
};

const findHeaderTable = tablesForAHome => tablesForAHome.filter(t => [...t.querySelectorAll('td b')].some(b => b.innerText.trim().startsWith(SIGNATURE_TEXT_FOR_HEADER_TABLE)))[0];

const findSellTable = tablesForAHome => tablesForAHome.filter(t => [...t.querySelectorAll('td b')].some(b => b.innerText.trim().startsWith(SIGNATURE_TEXT_FOR_SELL_TABLE)))[0];

const getAddress = headerTable => headerTable.querySelectorAll('td b')[2].innerText;

const getListingPrice = headerTable => {
	const raw = headerTable.querySelectorAll('td b')[4].innerText;
	return raw.replace('$', '').trim();
};

const getSellingPrice = sellTable => sellTable.querySelectorAll('td b')[5].innerText;

const getDaysOnMarket = sellTable => sellTable.querySelectorAll('td b')[7].innerText;


const starterTables = findAllTablesSignifyingStartOfAHome();
const tablesByHome = starterTables.map(groupTablesByHome);
const csvs = tablesByHome.map(domToCsv);
