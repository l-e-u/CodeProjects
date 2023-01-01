import './App.css';
import { useEffect, useState } from 'react';

class PiggyBank {
  constructor() {
    this.balance = 0;
    this.transactions = [];
    this.positions = new Map();
  };
  applyTrade(trade) {
    const position = this.positions.get(trade.company.ticker);

    // When company doesn't have an open position, set the ticker as the key and trade as the value, debit the trade amount from the balance and end function
    if (!position) {
      const { amount, company, shares } = trade;
      const trades = [
        {
          amount,
          shares,
          avgPrice: amount / shares
        }
      ]
      this.positions.set(company.ticker, { company, trades });
      this.balance -= amount;
      return;
    };

    // Find the remainder of shares after apply the trade to an open position
    const remainder = position.amount + trade.amount;
  }
};

// Accepts a date string and returns it formatted
function formattedDateString(dateString) {
  const date = new Date(dateString);
  const dateArr = date.toString().split(' ');
  const weekday = dateArr[0];
  const month = dateArr[1];
  const day = dateArr[2];
  const year = dateArr[3];
  const time = dateArr[4];
  const meridiem = date.getHours() <= 12 ? 'a' : 'p';

  return `${year} ${month} ${day} ${weekday} @${time}${meridiem}`;
}

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
      <HeadersSeparatedByDash
        header1={props.firstHeader}
        header2={props.secondHeader}
      />
      <UnorderedListTemplate
        items={props.trades}
      />
    </div>
  )
}

function HeadersSeparatedByDash(props) {
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
        setData(formattedData);
        // for debugging.....
        console.log(formattedData);
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
