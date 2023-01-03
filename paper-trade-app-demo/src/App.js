import './App.css';
import { useEffect, useState } from 'react';

class CompanyInfoAndTransactions {
  constructor({ name, ticker }) {
    this.name = name;
    this.ticker = ticker;
    this.transactions = [];
  }
}

class Transaction {
  constructor(amount, date) {
    this.amount = amount;
    this.date = new Date(date);
  }
}

class Position extends Transaction {
  constructor(amount, date, shares) {
    super(amount, date);
    this.shares = shares;
  }
}

class Trade extends Position {
  constructor({ amount, shares, date, note, id }) {
    super(amount, date, shares);
    this.note = note;
    this.id = id;
  }
}

function addCurrency(...amounts) {
  return (amounts.reduce((total, amount) => total + (amount * 100), 0) / 100);
}

// Return a transaction of realized gain or loss.
function getRealizedTransaction(posAmount, tradeAmount, date, isBuyBack) {
  // The difference between the original and new investment amounts is a realized gain or loss.
  // In a long position, a gain is profited when the new investment amount is more than its original amount. Otherwise, it's a loss.
  const difference = addCurrency(tradeAmount, -posAmount);

  // In a short position, a gain is profited when the buyback amount is less than its original amount. Otherwise, it's a loss. If this position was originally a short, negate the difference.
  const realizedAmount = isBuyBack ? -difference : difference;
  console.log("dif:", difference);
  console.log("buyback?:", isBuyBack);
  console.log("realized:", realizedAmount);
  // Add a split second to a gain/loss after the trade that triggered it.
  const splitSecondAfterDate = new Date(date.setMilliseconds(date.getMilliseconds() + 1));
  return new Transaction(realizedAmount, splitSecondAfterDate);
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
  const [trades, setTrades] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/trades')
      .then(res => res.json())
      .then(result => {
        setTrades(result);
        setLoaded(true);
      },
        (error) => {
          setLoaded(false);
          setError(error);
        })
  }, []);

  // Go through each trade, group them by ticker, manage positions, and apply gains/losses to cash.
  let cash = 0;
  const groups = [];
  const positions = new Map();

  trades.forEach(data => {
    const { company, ...trade } = data;
    const ticker = company.ticker;
    const TradeTransaction = new Trade(trade);

    // Push ticker group if new
    groups.some(group => group.ticker === ticker) ||
      groups.push(new CompanyInfoAndTransactions(company));

    // Push trade in its ticker group transactions array
    const tickerGroup = groups.find(group => group.ticker === ticker);
    tickerGroup.transactions.push(TradeTransaction);

    // When new position, set ticker/trade pair as key/value in map
    if (!positions.has(ticker)) {
      positions.set(ticker, new Position(trade.amount, trade.date, trade.shares));

      // Debit the trade amount from cash and end function.
      cash = addCurrency(cash, -TradeTransaction.amount);
      return;
    };


    // Apply trade to open position.
    // Number of position shares relative to trade shares determine how position is updated and any realized amounts applied to cash.
    const position = positions.get(ticker);
    const positionSharesRelativeToTradeShares = position.shares / TradeTransaction.shares;

    // Close Order: the shares cancel each other out, thus closing the position.
    if (positionSharesRelativeToTradeShares === -1) {
      const Realized = getRealizedTransaction(
        position.amount,
        TradeTransaction.amount,
        TradeTransaction.date,
        position.shares < 0
      );

      // Store the realized gain/loss in its ticker group, return investment, and close position.
      tickerGroup.transactions.push(Realized);

      // Credit the account the returning investment amount
      cash = addCurrency(cash, position.amount, Realized.amount);

      // Close the position because all shares have been covered.
      positions.delete(ticker);
    };
    console.log("cash:", cash);
  });

  return (
    <div className='App'>
      <AccountBalance amount={cash} />
      {/* <ListOfCompaniesAndTrades history={data} /> */}
    </div>
  );
}

export default App;
