const api = require('./api');
const symbol = process.env.SYMBOL;
const profitability = parseFloat(process.env.PROFITABILITY);

// setInterval(async () => {

// }, process.env.CRAWLER_INTERVAL)

setTimeout(async function() {
    let buy = 0, sell = 0;

    const result = await api.depth(symbol);
    if (result.bids && result.bids.length) {
        console.log(`Highest Buy: ${result.bids[0][0]}`);
        buy = parseFloat(result.bids[0][0]);
    }
    if (result.asks && result.asks.length) {
        console.log(`Lowest Sell: ${result.asks[0][0]}`);
        sell = parseFloat(result.asks[0][0]);
    }
    
    // console.log(await api.exchangeInfo());
    const account = await api.accountInfo();
    // const coins = account.balances.filter(b => symbol.indexOf(b.asset) !== -1);
    console.log(`MINHA CARTEIRA`);
    // console.log(coins);

    const eth = account.balances.filter(b => 'ETH'.indexOf(b.asset) !== -1);
    const bnb = account.balances.filter(b => 'BNB'.indexOf(b.asset) !== -1);
    const btc = account.balances.filter(b => 'BTC'.indexOf(b.asset) !== -1);
    console.log(eth);
    console.log(bnb);
    console.log(btc);


    // ORDENS DE COMPRA E VENDA

    // console.log('Verificando saldo disponível...');
    // const walletUSD = parseFloat(coins.find(c => asset.endsWith('USD')).free);
    // const qty = parseFloat((walletUSD / sell) - 0.00001).toFixed(5); // calculo de quantidade
    // if (sell <= walletUSD) {
    //     console.log('Saldo disponível. Efetuando ordem de compra...');
    //     const buyOrder = await api.newOrder(symbol, 0.2);
    //     console.log(`orderId: ${buyOrder.orderId}`);
    //     console.log(`status: ${buyOrder.status}`);
    //     if (buyOrder.status === 'FILLED') {
    //         console.log('Posicionando venda futura...');
    //         const price = parseFloat(sell * profitability).toFixed(8);
    //         console.log(`Vendendo por ${price} (${profitability})`);
    //         const sellOrder = await api.newOrder(symbol, 1, price, 'SELL', 'LIMIT');
    //         console.log(`orderId: ${sellOrder.orderId}`);
    //         console.log(`status: ${sellOrder.status}`);
    //     }
    // } else {
    //     console.log('Saldo insuficiente para realizar essa compra!');
    // }

}, process.env.CRAWLER_INTERVAL);
