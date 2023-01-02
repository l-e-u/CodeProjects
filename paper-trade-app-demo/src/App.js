import './App.css';
import { useEffect, useState } from 'react';

class CompanyInfoAndTransactions {
  constructor({ name, ticker, id }) {
    this.name = name;
    this.ticker = ticker;
    this.id = id;
    this.transactions = [];
  }
}

class Transaction {
  constructor(amount, date) {
    this.amount = amount * 100;
    this.date = new Date(date);
  }
}

class Position extends Transaction {
  constructor(amount, date, shares) {
    super(amount, date);
    this.shares = shares;
  }
}

class Trade extends Transaction {
  constructor({ amount, date, note, id }) {
    super(amount, date);
    this.note = note;
    this.id = id;
  }
}

class PiggyBank {
  constructor() {
    this.balance = 0;
    this.transactionsGroupedByTicker = [];
    this.positionsMapByTicker = new Map();
  };
  // Accepts one trade and groups it by ticker.
  // If applicable, apply the trade to an open position, or open a new position.
  // When appropriate, calc realized and/or apply to balance.
  applyTrade(data) {
    const { company, ...trade } = data;
    const ticker = company.ticker;
    const TradeTransaction = new Trade(trade);
    debugger;
    // Add a new group if one doesn't exist
    this.transactionsGroupedByTicker.includes(group => group.ticker === ticker) ||
      this.transactionsGroupedByTicker.push(new CompanyInfoAndTransactions(company));

    // Store the trade in its ticker group.
    this.transactionsGroupedByTicker
      .find(group => group.ticker === ticker)
      .transactions
      .push(TradeTransaction);

    // When company doesn't have an open position, set ticker/trade pair as key/value in map
    if (!this.positionsMapByTicker.has(ticker)) {
      this.positionsMapByTicker.set(ticker, [new Position(trade.amount, trade.date, trade.shares)]);

      // Debit the trade amount from balance and end function.
      this.balance -= TradeTransaction.amount;
      return;
    };


    // Apply trade to open position.
    // Number of position shares relative to trade shares determine how position is updated and any realized amounts applied to balance.
    const position = this.positionsMapByTicker.get(ticker);
    const positionSharesRelativeToTradeShares = position.shares / TradeTransaction.shares;

    // Close Order: the shares cancel each other out, thus closing the position.
    // if (positionSharesRelativeToTradeShares === 0) {
    //   const Realized = new Transaction(
    //     TradeTransaction.company,
    //     (position.amount + TradeTransaction.amount),
    //     TradeTransaction.date);
    //   this.positionsMapByTicker.get(ticker).push(Realized);
    // };

  }
};

function getCurrencyString(total) {
  return (total / 100).toFixed(2);
};

// Displays the calculated cash amount
function AccountBalance(props) {
  let balance = props.amount || 0;

  return (
    <h1 className='acctBalDisplay usdCurrencySymbol'>{balance}</h1>
  )
}

// Returns an unordered list with one item that holds the columns' names
function ColumnHeaders() {
  return (
    <div className='columnContainer d-flex font-weight-bold small border-bottom pb-1 mb-2'>
      <strong className='column text-center'>When</strong>
      <strong className='column text-end'>Avg Price</strong>
      <strong className='column text-end'>Shares</strong>
      <strong className='column text-end'>Position</strong>
    </div>
  )
}

// Every company listed displays its name and ticker followed by recorded trades below
function CompanyDetailsAndTrades(props) {
  return (
    <div>
      <CompanyTickerHeaders
        header1={props.firstHeader}
        header2={props.secondHeader}
      />
      <UnorderedListTemplate
        items={props.trades}
      />
    </div>
  )
}

function CompanyTickerHeaders(props) {
  return <h4>{props.header1 + ' - ' + props.header2}</h4>;
}

function FormattedDate(props) {
  const date = new Date(props.dateString);
  const dateArr = date.toString().split(' ');
  const weekday = dateArr[0];
  const month = dateArr[1];
  const day = dateArr[2];
  const year = dateArr[3];
  const time = dateArr[4];
  const meridiem = date.getHours() <= 12 ? 'a' : 'p';

  return (
    <div className='d-flex flex-wrap'>
      <div>{`${year} ${month} ${day} ${weekday}`}</div>
      <small className='align-self-end ps-5 ps-sm-2'>{`@${time}${meridiem}`}</small>
    </div>
  )
}

function UnorderedListTemplate(props) {
  return (
    <ul className='list-unstyled my-1 mx-0 pb-2 pe-0'>
      {props.items.map((entry, index) => {
        const price = Math.abs(entry.amount / entry.shares).toFixed(2);

        return (
          <li className='columnContainer d-flex small' key={index}>
            <div className='column'><FormattedDate dateString={entry.date} /></div>
            <div className='column text-end'>{price}</div>
            <div className='column text-end'>{entry.shares}</div>
            <div className='column text-end'>{entry.amount}</div>
          </li>
        )
      })}
    </ul>
  )
}

function ListOfCompaniesAndTrades(props) {

  const companiesAndTradeHistoryJSX = props.history.map(data => {
    return (
      <CompanyDetailsAndTrades
        key={data.company.ticker}
        firstHeader={data.company.ticker}
        secondHeader={data.company.name}
        trades={data.trades}
      />
    )
  });

  return (
    <div className='tradesDisplay'>
      <ColumnHeaders />
      {companiesAndTradeHistoryJSX}
    </div>
  )
}

function App() {
  const [data, setData] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/trades')
      .then(res => res.json())
      .then((result) => {
        const formattedData = [];
        setLoaded(true);

        /*
        Group the trades by company and format the data.
        Take the first trade and filter out the next trades under the same company,
        remove those trades from the array,
        store the formatted data into a separate array,
        splice out the filtered trades from the original array,
        repeat until the original array is empty.
        */
        result.forEach((trade, index, arr) => {
          const { company } = trade;
          const filteredTrades = arr.filter(t => t.company.ticker === company.ticker);
          const numOfFilteredTrades = filteredTrades.length;

          formattedData.push(
            {
              company,
              trades: filteredTrades.map(t => {
                const { company, ...other } = t;
                return other;
              })
            }
          );
          arr.splice(0, numOfFilteredTrades);
        });

        // Sort the formated data by company ticker by default.
        formattedData.sort((a, b) => {
          const ticker1 = a.company.ticker.toUpperCase();
          const ticker2 = b.company.ticker.toUpperCase();

          if (ticker1 < ticker2) return -1;
          if (ticker1 > ticker2) return 1;
          return 0;
        });

        const piggy = new PiggyBank();
        debugger;
        piggy.applyTrade(
          {
            "amount": 411.24,
            "shares": -94,
            "date": "2022-12-28T20:35:46.232Z",
            "note": "Etiam molestie vestibulum ligula vel vulputate.",
            "id": "63aca8a270fd2b5378eea5ec",
            "company": {
              "ticker": "ACN",
              "name": "Accenture",
              "id": "63aca885dc397a342ad9821d"
            }
          });


        setData(formattedData);
        // for debugging.....
        // console.log(formattedData);
      },
        (error) => {
          setLoaded(false);
          setError(error);
        })
  }, []);

  return (
    <div className='App'>
      <AccountBalance amount={500} />
      <ListOfCompaniesAndTrades history={data} />
    </div>
  );
}

export default App;
