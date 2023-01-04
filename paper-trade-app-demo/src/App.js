import './App.css';
import { useEffect, useState } from 'react';

const USDollar = new Intl.NumberFormat(
  'en-US',
  {
    style: 'currency',
    currency: 'USD',
  }
);

// All transactions are grouped by ticker
class CompanyInfoAndTransactions {
  constructor({ name, ticker }) {
    this.name = name;
    this.ticker = ticker;
    this.transactions = [];
  }
}

// The basis for all transactions, a realized entry only needs this base.
class Transaction {
  constructor(amount, date) {
    this.amount = amount;
    this.date = new Date(date);
  }
}

// For positions that are currently open.
class Position extends Transaction {
  constructor(amount, date, shares) {
    super(amount, date);
    this.shares = shares;
    this.price = amount / shares;
  }
}

// Any transaction that involves buying/selling shares.
class Trade extends Position {
  constructor({ amount, shares, date, note, id }) {
    super(amount, date, shares);
    this.note = note;
    this.id = id;
  }
}

// Converts each amount to pennies (integers) for addition then returns decimal.
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

function AddTradeForm(props) {
  return (
    <form>
      <div class="mb-3">
        <label for="ticker" class="form-label">Ticker</label>
        <input type="text" class="form-control" id="ticker" />
      </div>
      <div class="mb-3">
        <label for="company" class="form-label">Company</label>
        <input type="text" class="form-control" id="company" />
      </div>
      <div class="mb-3 form-check">
        <input type="checkbox" class="form-check-input" id="shortSell" />
        <label class="form-check-label" for="shortSell">short/sell</label>
      </div>
      <button type="submit" class="btn btn-primary">Submit</button>
    </form>
  )
};

// Displays the calculated cash amount
function CashHeader(props) {
  let balance = USDollar.format(props.total);

  return (
    <h1 className='text-end tabluarNumbers pe-4'>{balance}</h1>
  )
}

// Returns an unordered list with one item that holds the columns' names
function ColumnHeaders() {
  return (
    <div className='rowOfItems d-flex font-weight-bold small border-bottom pb-1 mb-2'>
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

// Returns ticker and name of company separated by dash.
function CompanyTickerHeaders(props) {
  return <h4>{props.header1 + ' - ' + props.header2}</h4>;
}

// Parses a date and returns a custom format.
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

function Menu(props) {
  return (
    <div className='d-flex justify-content-between px-1'>
      <button
        type='button'
        className='btn btn-link btn-sm text-secondary'
      >
        +Trade
      </button>
      <button
        type='button'
        className='btn btn-link btn-sm text-secondary'
        onClick={() => window.location.reload()}
      >
        -logout {props.name}
      </button>
    </div>
  )
};

// Returns a list of all the trades and realized gains/losses for the ticker group
function UnorderedListTemplate(props) {
  return (
    <ul className='list-unstyled my-1 mx-0 pb-2 pe-0'>
      {props.items.map((entry, index) => {
        const isRealizedTransaction = !(entry instanceof Trade);
        let realizedCssClass = 'list-group-item-';
        realizedCssClass += entry.amount > 0 ? 'success' : 'danger';

        // Return following element if entry is a realized transaction.
        if (isRealizedTransaction) {
          return (
            <li className='d-flex justify-content-end small' key={index}>
              <div className={'text-end mx-n2 px-n2 ' + realizedCssClass}>
                Realized:<span className='ps-2'>{USDollar.format(entry.amount)}</span>
              </div>
            </li>
          );
        };

        // Return following element if entry is a trade transaction.
        return (
          <li className='rowOfItems d-flex small' key={index}>
            <div className='column'><FormattedDate dateString={entry.date} /></div>
            <div className='column text-end'>{USDollar.format(entry.price)}</div>
            <div className='column text-end'>{entry.shares}</div>
            <div className='column text-end'>{USDollar.format(entry.amount)}</div>
          </li>
        )
      })}
    </ul>
  )
}

// Returns element displaying ticker and company name with list of its transactions.
function ListOfCompaniesAndTrades(props) {
  return (
    <div className='tradesDisplay'>
      <ColumnHeaders />
      {props.history.map(group => {
        return (
          <CompanyDetailsAndTrades
            key={group.ticker}
            firstHeader={group.ticker}
            secondHeader={group.name}
            trades={group.transactions}
          />
        )
      })}
    </div>
  )
}

function App() {
  const [username, setUsername] = useState('elihu');
  const [userId, setUserId] = useState('639cc46151da8d964f60390b');
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
      <div className='topDisplay'>
        <Menu name={username} />
        <CashHeader total={cash} />
      </div>
      <AddTradeForm />
      <ListOfCompaniesAndTrades history={groups} />
    </div>
  );
}

export default App;
