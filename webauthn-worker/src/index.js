import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

const DEBUG = false;

addEventListener('fetch', (event) => {
  event.respondWith(handleEvent(event));
});

/**
 * Custom handler to serve assets and inject environment variables.
 */
async function handleEvent(event) {
  const url = new URL(event.request.url);

  // Options for getAssetFromKV
  const options = {
    // Cache options
    cacheControl: {
      bypassCache: DEBUG,
    },
  };

  try {
    // Serve static assets
    let response = await getAssetFromKV(event, options);

    // Check if the request is for index.html or root
    if (url.pathname === '/' || url.pathname.endsWith('index.html')) {
      // Get the raw HTML content
      let html = await response.text();

      // Inject environment variables into the HTML
      html = injectEnvVariables(html);

      // Create a new Response with the modified HTML
      response = new Response(html, {
        headers: response.headers,
        status: response.status,
        statusText: response.statusText,
      });
    }

    return response;
  } catch (e) {
    // Handle errors and serve a custom 404 page if available
    if (!DEBUG) {
      try {
        const notFoundResponse = await getAssetFromKV(event, {
          mapRequestToAsset: (req) =>
            new Request(`${new URL(req.url).origin}/404.html`, req),
        });
        return new Response(notFoundResponse.body, {
          ...notFoundResponse,
          status: 404,
        });
      } catch (e) {}
    }

    return new Response(e.message || e.toString(), { status: 500 });
  }
}

/**
 * Function to inject environment variables into HTML.
 */
function injectEnvVariables(html) {
  // Construct the window.APP_CONFIG object
  const appConfig = {
    networkPassphrase:"Test SDF Network ; September 2015",
  nativeContractId:"CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
  factoryContractWasm:"8e4b75ff2837444c31d42edba0a0978076c62f6c825eeb2a6acdc915fa586e69",
  factoryContractId:"CDH4DQRN72DTVN2KM2EKHWEEVATV6U7IWR2KS4QJQPYTEWSCY4GOKQTZ",
  accountEd25519ContractWasm:"7fb9b975679cceb791e9357bdc5409fccf641d87d21ba075364dd4544bfa10e3",
  accountSecp256r1ContractWasm:"9abc34e4a464736a1e075e7e282f898a8e66f89171d11807a04b75ea4ade3c77",
  friendbotUrl:"https://friendbot.stellar.org",
  horizonUrl:"https://horizon-testnet.stellar.org",
  explorerContractUrl:"https://testnet.steexp.com/contract",
  explorerAccountUrl:"https://testnet.steexp.com/account",
  explorerTxUrl:"https://testnet.steexp.com/tx"
  };

  // Serialize the appConfig object
  const appConfigScript = `<script>
    window.APP_CONFIG = ${JSON.stringify(appConfig)};
  </script></head>`;

  // Inject the script before the closing </head> tag
  return html.replace('</head>', appConfigScript);
}