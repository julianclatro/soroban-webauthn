# Soroban Webauthn Account Contract

| :warning: Code in this repo is demo material only. It has not been audited. Do not use to hold, protect, or secure anything. |
| ---------------------------------------------------------------------------------------------------------------------------- |

This repo contains [Soroban] contracts that demonstrate account abstraction on [Stellar], by supporting [Webauthn].

#### Build and Deploy:

```
cd web-app-demo && deno run --allow-net --allow-read https://deno.land/std/http/file_server.ts

cd contract-webauthn-factory && stellar contract build --out-dir ../out
cd contract-webauthn-ed25519 && stellar contract build --out-dir ../out
cd contract-webauthn-secp256r1 && stellar contract build --out-dir ../out

stellar contract optimize --wasm ./out/webauthn_factory.wasm
stellar contract optimize --wasm ./out/webauthn_account_ed25519.wasm
stellar contract optimize --wasm ./out/webauthn_account_secp256r1.wasm

ls -lah out/*.optimized.wasm
shasum -a 256 ./out/*.optimized.wasm

    
stellar contract deploy --wasm out/webauthn_factory.optimized.wasm
stellar contract install --wasm out/webauthn_account_ed25519.optimized.wasm
stellar contract install --wasm out/webauthn_account_secp256r1.optimized.wasm
```

#### Run the frontend:

```
cd webauthn-worker
wrangler dev
```

#### Contracts:

- `contract-webauthn-factory` – A Soroban factory contract that deploys and initializes new deployments of webauthn contract accounts.
- `contract-webauthn-ed25519` – A Soroban account contract that is initialized with a ed25519 public key for a Webauthn device (passkey from a browser, computer, phone, Yubikey, etc). This contract acts as an account on network, holding assets, etc, and is controlled by the Webauthn device's signatures.
- `contract-webauthn-secp256r1` – A Soroban account contract that is initialized with a ecdsa secp256r1 public key for a Webauthn device (passkey from a browser, computer, phone, Yubikey, etc). This contract acts as an account on network, holding assets, etc, and is controlled by the Webauthn device's signatures.

#### Frontend:

- `webauth-worker` – A demo web application. The demo interacts with the Stellar Test Network. The demo registers a device for webauthn, deploys an account contract for the device, and performs some transactions with it.

https://github.com/leighmcculloch/soroban-webauthn/assets/351529/b326562a-cadf-40db-aa75-f2823c8d2554

[Stellar]: https://stellar.org
[Soroban]: https://soroban.stellar.org
[Webauthn]: https://www.w3.org/TR/webauthn-2/