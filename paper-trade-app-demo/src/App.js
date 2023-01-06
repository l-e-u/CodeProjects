import './App.css';
import { useEffect, useState } from 'react';

const USDollarString = new Intl.NumberFormat(
  'en-US',
  { style: 'currency', currency: 'USD' }
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
};

// Returns a number by default, with the option of returning a USD currency string.
function currencyMath(amount, returnString = false) {
  if (returnString) {
    return (
      new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
        .format(amount)
    );
  };

  return (
    Number(
      new Intl.NumberFormat('en-US', { useGrouping: false })
        .format(amount)
    )
  );
};

// Return a transaction of realized gain or loss.
function getRealizedTransaction(posAmount, tradeAmount, date, isBuyBack) {
  // The difference between the original and new investment amounts is a realized gain or loss.
  // In a long position, a gain is profited when the new investment amount is more than its original amount. Otherwise, it's a loss.
  // const difference = addCurrency(tradeAmount, -posAmount);
  const difference = currencyMath(tradeAmount - posAmount);

  // In a short position, a gain is profited when the buyback amount is less than its original amount. Otherwise, it's a loss. If this position was originally a short, negate the difference.
  const realizedAmount = isBuyBack ? -difference : difference;


  // DEBUGGING CONSOLES-------------------
  // console.log("dif:", difference);
  // console.log("buyback?:", isBuyBack);
  // console.log("realized:", realizedAmount);
  // END - DEBUGGING CONSOLES --------------

  // Add a split second to a gain/loss after the trade that triggered it.
  const splitSecondAfterDate = new Date(date.setMilliseconds(date.getMilliseconds() + 1));
  return new Transaction(realizedAmount, splitSecondAfterDate);
};

function TradeForm(props) {
  const [ticker, setTicker] = useState('');
  const [company, setCompany] = useState('');
  const [date, setDate] = useState(new Date().toISOString());
  const [shares, setShares] = useState(1);
  const [price, setPrice] = useState(0.01);
  const [isSelling, setIsSelling] = useState(false);
  const [note, setNote] = useState('');

  const amount = currencyMath(shares * price);

  function handleSaveOnClick() {
    const tradeData = {
      company: {
        ticker,
        name: company,
      },
      date,
      note,
      amount,
      shares: Number(isSelling ? -shares : shares),
      user_id: props.userId
    };

    // Send POST request with options and JSON body.
    fetch('http://localhost:8000/trades', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      body: JSON.stringify(tradeData)
    })
      .then(response => response.json())
      .then(addedTrade => {
        // Successful response appends added trade to the rest.
        props.setTrades(allTrades => {
          let array = [...allTrades];
          array.push(addedTrade);
          return array;
        });
      });
  };

  function handleOnChange(setInputState) {
    return (event) => setInputState(event.target.value);
  }

  return (
    <form className="collapse mb-3" id="tradeForm">
      {/* Ticker */}
      <div className="row mb-3">
        <label htmlFor="ticker" className="col-sm-2 col-form-label col-form-label-sm">Ticker</label>
        <div className="col-sm-10">
          <input type="text" className="form-control form-control-sm" id="ticker" value={ticker} onChange={handleOnChange(setTicker)} />
        </div>
      </div>
      {/* Company */}
      <div className="row mb-3">
        <label htmlFor="company" className="col-sm-2 col-form-label col-form-label-sm">Company</label>
        <div className="col-sm-10">
          <input type="text" className="form-control form-control-sm" id="company" value={company} onChange={handleOnChange(setCompany)} />
        </div>
      </div>
      {/* Date Time */}
      <div className="row mb-3">
        <label htmlFor="date" className="col-sm-2 col-form-label col-form-label-sm">Date</label>
        <div className="col-sm-10">
          <input type="datetime-local" className="form-control form-control-sm" id="date" value={date.slice(0, date.length - 1)} onChange={handleOnChange(setDate)} />
        </div>
      </div>
      {/* Shares */}
      <div className="row mb-3">
        <label htmlFor="shares" className="col-sm-2 col-form-label col-form-label-sm">Shares</label>
        <div className="mb-1 col-sm-2">
          {/* Sell/Short */}
          <div className="form-check form-control-sm">
            <input type="checkbox" className="form-check-input" id="shortSell" checked={isSelling} onChange={handleOnChange(setIsSelling)} />
            <label className="form-check-label" htmlFor="shortSell">sell/short</label>
          </div>
        </div>
        <div className="col-sm-8">
          <input type="number" min={1} className="form-control form-control-sm" id="shares" value={shares} onChange={handleOnChange(setShares)} />
        </div>
      </div>
      {/* Price */}
      <div className="row mb-3">
        <label htmlFor="price" className="col-sm-2 col-form-label col-form-label-sm">Price ($)</label>
        <div className="col-sm-10">
          <input type="number" min={0.01} step={0.01} className="form-control form-control-sm" id="price" value={price} onChange={handleOnChange(setPrice)} />
        </div>
      </div>
      {/* Amount */}
      <div className="row mb-3">
        <label htmlFor="amount" className="col-sm-2 col-form-label col-form-label-sm">Amount ($)</label>
        <div className="col-sm-10">
          <input type="text" readOnly className="form-control form-control-sm" id="amount" value={amount} />
        </div>
      </div>
      {/* Note */}
      <div className="row mb-3">
        <label htmlFor="note" className="col-sm-2 col-form-label col-form-label-sm">Note</label>
        <div className="col-sm-10">
          <textarea className="form-control form-control-sm" id="note" value={note} onChange={handleOnChange(setNote)}></textarea>
        </div>
      </div>
      {/* Save/Update and Cancel buttons */}
      <div className="d-flex justify-content-end">
        <button type="button" className="btn btn-danger btn-sm" >Cancel</button>
        <button type="button" className="btn btn-primary btn-sm ms-3" onClick={handleSaveOnClick}>Save</button>
      </div>
    </form>
  )
};

// Displays the calculated cash amount
function CashHeader(props) {
  let balance = props.total;

  return (
    <h1 className='text-end tabluarNumbers pe-4'>{USDollarString.format(balance)}</h1>
  )
}

// Returns an unordered list with one item that holds the columns' names
function ColumnHeaders() {
  return (
    <div className='rowOfItems d-flex font-weight-bold small border-bottom pb-1 mb-2'>
      <strong className='column text-center'>When</strong>
      <strong className='column text-end'>Avg Price</strong>
      <strong className='column text-end'>Shares</strong>
      <strong className='column text-end'>Amount</strong>
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
        className='btn btn-sm text-secondary'
        data-bs-toggle="collapse"
        data-bs-target="#tradeForm"
        aria-expanded="false"
        aria-controls="tradeForm"
      >
        +trade
      </button>
      <button
        type='button'
        className='btn btn-sm text-secondary'
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
                Realized:<span className='ps-2'>{USDollarString.format(entry.amount)}</span>
              </div>
            </li>
          );
        };

        // Return following element if entry is a trade transaction.
        return (
          <li className='rowOfItems d-flex small' key={index}>
            <div className='column'><FormattedDate dateString={entry.date} /></div>
            <div className='column text-end'>{USDollarString.format(entry.price)}</div>
            <div className='column text-end'>{entry.shares}</div>
            <div className='column text-end'>{USDollarString.format(entry.amount)}</div>
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
      // cash = addCurrency(cash, -TradeTransaction.amount);
      cash = currencyMath(cash - TradeTransaction.amount);
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
      // cash = addCurrency(cash, position.amount, Realized.amount);
      cash = currencyMath(cash + position.amount + Realized.amount);

      // Close the position because all shares have been covered.
      positions.delete(ticker);
    };

    // DEBUGGING CONSOLE----------
    // console.log("cash:", cash);
  });

  return (
    <div className='App'>
      <div className='topDisplay'>
        <Menu name={username} />
        <CashHeader total={cash} />
      </div>
      <TradeForm
        userId={userId}
        setTrades={setTrades} />
      <ListOfCompaniesAndTrades history={groups} />
    </div>
  );
}

export default App;
