export async function getEthPrice() {
  const response = await fetch(
    "https://api.etherscan.io/api?module=stats&action=ethprice&apikey=WQKFCBRTDD6E9WEI9EBJRZS1RU1T1ZHSA8"
  );

  const data = await response.json();

  if (data.status === "1") {
    return {
      price: data.result.ethusd,
      priceLastUpdate: data.result.ethusd_timestamp,
    };
  }

  return null;
}
