const coins = ['bitcoin', 'ethereum', 'ripple', 'solana', 'binancecoin'];
const names = ['BTC', 'ETH', 'XRP', 'SOL', 'BNB'];
const container = document.getElementById('crypto-container');

async function fetchCryptoData() {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coins.join(',')}&vs_currencies=usd&include_24hr_change=true`;

  const res = await fetch(url);
  const data = await res.json();

  container.innerHTML = '';
  coins.forEach((coin, index) => {
    const price = data[coin].usd;
    const change = data[coin].usd_24h_change.toFixed(2);
    const trend = change >= 0 ? '📈' : '📉';

    const card = document.createElement('div');
    card.className = 'crypto-card';
    card.innerHTML = `
      <h2>${names[index]}</h2>
      <p>Price: $${price}</p>
      <p>24h Change: ${change}% ${trend}</p>
    `;
    container.appendChild(card);
  });
}

async function drawChart() {
  const res = await fetch(`https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1`);
  const data = await res.json();

  const labels = data.prices.map(price => {
    const date = new Date(price[0]);
    return date.getHours() + ':' + date.getMinutes();
  });

  const prices = data.prices.map(price => price[1]);

  const ctx = document.getElementById('priceChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'BTC Price (24h)',
        data: prices,
        borderColor: 'cyan',
        fill: false
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: { display: false },
        y: { beginAtZero: false }
      }
    }
  });
}

fetchCryptoData();
drawChart();
setInterval(fetchCryptoData, 60000); // refresh per menit
