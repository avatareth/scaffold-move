"use client";

import { useAutoConnect } from "@/components/AutoConnectProvider";
import { DisplayValue, LabelValueGrid } from "@/components/LabelValueGrid";
import { ThemeToggle } from "@/components/ThemeToggle";
// import { WalletSelector as ShadcnWalletSelector } from "@/components/WalletSelector";
// import { MultiAgent } from "@/components/transactionFlows/MultiAgent";
import { SingleSigner } from "@/components/transactionFlows/SingleSigner";
import { useToast } from "@/components/ui/use-toast";
// import { Sponsor } from "@/components/transactionFlows/Sponsor";
// import { TransactionParameters } from "@/components/transactionFlows/TransactionParameters";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  // CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// s
// import { Switch } from "@/components/ui/switch";
// import { isMainnet } from "@/utils";
import { Aptos, Network, AptosConfig } from "@aptos-labs/ts-sdk";
// import { WalletSelector as AntdWalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
// import { WalletConnector as MuiWalletSelector } from "@aptos-labs/wallet-adapter-mui-design";
import {
  AccountInfo,
  AptosChangeNetworkOutput,
  NetworkInfo,
  WalletInfo,
  isAptosNetwork,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";
import { init as initTelegram } from "@telegram-apps/sdk";
import { AlertCircle } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

// Imports for registering a browser extension wallet plugin on page load
// import { MyWallet } from "@/utils/standardWallet";
// import { registerWallet } from "@aptos-labs/wallet-standard";

import { NavBar } from "@/components/NavBar";

import { AptosWallet } from "@aptos-labs/wallet-standard";

import { WalletButton } from "@/components/wallet/WalletButton";

// Add this interface declaration at the top of the file, after the imports
declare global {
  interface Window {
    nightly?: {
      aptos: AptosWallet;
    };
  }
}

// Example of how to register a browser extension wallet plugin.
// Browser extension wallets should call registerWallet once on page load.
// When you click "Connect Wallet", you should see "Example Wallet"
// (function () {
//   if (typeof window === "undefined") return;
//   const myWallet = new MyWallet();
//   registerWallet(myWallet);
// })();

const isTelegramMiniApp =
  typeof window !== "undefined" &&
  (window as any).TelegramWebviewProxy !== undefined;
if (isTelegramMiniApp) {
  initTelegram();
}

async function doGetBalance(aptos: Aptos, accountAddress: string) {
  const [balance] = await aptos.view({
    payload: {
      function: "0x1::coin::balance",
      typeArguments: ["0x1::aptos_coin::AptosCoin"],
      functionArguments: [accountAddress],
    },
  });
  return balance;
}

async function buildSimpleTransaction(
  aptos: Aptos,
  senderAddress: string,
  recipientAddress: string,
  amount: number
) {
  return await aptos.transaction.build.simple({
    sender: senderAddress,
    data: {
      function: "0x1::coin::transfer",
      typeArguments: ["0x1::aptos_coin::AptosCoin"],
      functionArguments: [recipientAddress, amount],
    },
  });
}

export default function Home() {
  const { toast } = useToast();

  const {
    account,
    connected,
    network,
    wallet,
    changeNetwork,
    signAndSubmitTransaction,
  } = useWallet();

  // Move these inside useEffect to only run after connection
  const [adapter, setAdapter] = useState<AptosWallet | null>(null);
  const [aptos, setAptos] = useState<Aptos | null>(null);

  useEffect(() => {
    if (connected) {
      const nightly = window.nightly?.aptos as AptosWallet;
      // const nightlyAdapter = nightly?.standardWallet as AptosWallet;
      console.log("nightlyAdapter", nightly);
      setAdapter(nightly);

      const aptosConfig = new AptosConfig({
        network: Network.TESTNET,
        fullnode: "https://aptos.testnet.porto.movementlabs.xyz/v1",
      });
      setAptos(new Aptos(aptosConfig));
    }
  }, [connected]);

  const getBalance = useCallback(async () => {
    if (!account?.address || !adapter || !aptos) return;
    const balance = await doGetBalance(aptos, account.address);
    toast({
      title: "balance",
      description: balance!.toString(),
    });
  }, [aptos, account]);

  // Example usage within your component:
  const handleTransaction = useCallback(async () => {
    // Docs: https://docs.nightly.app/docs/aptos/solana/connect
    console.log("info", account, adapter, aptos);
    if (!account?.address) return;
    const aptosConfig = new AptosConfig({
      network: network?.name || Network.MAINNET,
    });
    const aptosClient = new Aptos(aptosConfig);
    const signedTx = await signAndSubmitTransaction({
      sender: account.address,
      data: {
        function: "0x1::coin::transfer",
        typeArguments: ["0x1::aptos_coin::AptosCoin"],
        functionArguments: [
          "0x960dbc655b847cad38b6dd056913086e5e0475abc27152b81570fd302cb10c38",
          100,
        ],
      },
    });
    try {
      await aptosClient.waitForTransaction({ transactionHash: signedTx.hash });
    } catch (error) {
      console.error(error);
    }

    // const transaction = await buildSimpleTransaction(
    //   aptos,
    //   account.address,
    //   "0x960dbc655b847cad38b6dd056913086e5e0475abc27152b81570fd302cb10c38",
    //   100
    // );

    // console.log("transaction", transaction);

    // const signedTx = await adapter.features[
    //   "aptos:signTransaction"
    // ].signTransaction(transaction);

    // TODO: adapt with OKX and petra here.

    toast({
      title: signedTx.status,
      description: "This transaction has been " + signedTx.status,
    });
  }, [account]);

  return (
    <main className="flex flex-col w-full max-w-[1000px] p-6 pb-12 md:px-8 gap-6">
      <div className="flex justify-between items-center">
        <NavBar />
        <WalletButton />
        <ThemeToggle />
      </div>
      {connected && (
        <>
          <button
            onClick={getBalance}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            // disabled={!connected || !adapter || !aptos}
          >
            View Example: Get Balance
          </button>
          <button
            onClick={handleTransaction}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            // disabled={!connected || !adapter || !aptos}
          >
            Send Transaction Example: Transfer
          </button>
          <WalletConnection
            account={account}
            network={network}
            wallet={wallet}
            changeNetwork={changeNetwork}
          />
        </>
      )}
      {/* <div className="flex justify-between gap-6 pb-10">
        
        <div className="flex flex-col gap-2 md:gap-3">
          <h1 className="text-xl sm:text-3xl font-semibold tracking-tight">
            Scaffold Movement
            {network?.name ? ` — ${network.name}` : ""}
          </h1>
          <a
            href="https://github.com/aptos-labs/aptos-wallet-adapter/tree/main/apps/nextjs-example"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-muted-foreground underline underline-offset-2 font-medium leading-none"
          >
            Demo App Source Code
          </a>
        </div>
      </div> */}
      {/* {connected && isMainnet(connected, network?.name) && (
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            The transactions flows below will not work on the Mainnet network.
          </AlertDescription>
        </Alert>
      )} */}
      {connected && (
        <>
          <SingleSigner />
          {/* <TransactionParameters />
          <Sponsor />
          <MultiAgent /> */}
        </>
      )}
    </main>
  );
}

interface WalletConnectionProps {
  account: AccountInfo | null;
  network: NetworkInfo | null;
  wallet: WalletInfo | null;
  changeNetwork: (network: Network) => Promise<AptosChangeNetworkOutput>;
}

function WalletConnection({
  account,
  network,
  wallet,
  changeNetwork,
}: WalletConnectionProps) {
  const isValidNetworkName = () => {
    if (isAptosNetwork(network)) {
      return Object.values<string | undefined>(Network).includes(network?.name);
    }
    // If the configured network is not an Aptos network, i.e is a custom network
    // we resolve it as a valid network name
    return true;
  };

  // TODO: Do a proper check for network change support
  const isNetworkChangeSupported = wallet?.name === "Nightly";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet Connection</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-10 pt-6">
        <div className="flex flex-col gap-6">
          <h4 className="text-lg font-medium">Wallet Details</h4>
          <LabelValueGrid
            items={[
              {
                label: "Icon",
                value: wallet?.icon ? (
                  <Image
                    src={wallet.icon}
                    alt={wallet.name}
                    width={24}
                    height={24}
                  />
                ) : (
                  "Not Present"
                ),
              },
              {
                label: "Name",
                value: <p>{wallet?.name ?? "Not Present"}</p>,
              },
              {
                label: "URL",
                value: wallet?.url ? (
                  <a
                    href={wallet.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 dark:text-blue-300"
                  >
                    {wallet.url}
                  </a>
                ) : (
                  "Not Present"
                ),
              },
            ]}
          />
        </div>

        <div className="flex flex-col gap-6">
          <h4 className="text-lg font-medium">Account Info</h4>
          <LabelValueGrid
            items={[
              {
                label: "Address",
                value: (
                  <DisplayValue
                    value={account?.address ?? "Not Present"}
                    isCorrect={!!account?.address}
                  />
                ),
              },
              {
                label: "Public key",
                value: (
                  <DisplayValue
                    value={account?.publicKey.toString() ?? "Not Present"}
                    isCorrect={!!account?.publicKey}
                  />
                ),
              },
              {
                label: "ANS name",
                subLabel: "(only if attached)",
                value: <p>{account?.ansName ?? "Not Present"}</p>,
              },
              {
                label: "Min keys required",
                subLabel: "(only for multisig)",
                value: (
                  <p>{account?.minKeysRequired?.toString() ?? "Not Present"}</p>
                ),
              },
            ]}
          />
        </div>

        <div className="flex flex-col gap-6">
          <h4 className="text-lg font-medium">Network Info</h4>
          <LabelValueGrid
            items={[
              {
                label: "Network name",
                value: (
                  <DisplayValue
                    value={network?.name ?? "Not Present"}
                    isCorrect={isValidNetworkName()}
                    expected={Object.values<string>(Network).join(", ")}
                  />
                ),
              },
              {
                label: "URL",
                value: network?.url ? (
                  <a
                    href={network.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 dark:text-blue-300"
                  >
                    {network.url}
                  </a>
                ) : (
                  "Not Present"
                ),
              },
              {
                label: "Chain ID",
                value: <p>{network?.chainId ?? "Not Present"}</p>,
              },
            ]}
          />
        </div>

        {/* <div className="flex flex-col gap-6">
          <h4 className="text-lg font-medium">Change Network</h4>
          <RadioGroup
            value={network?.name}
            orientation="horizontal"
            className="flex gap-6"
            onValueChange={(value: Network) => changeNetwork(value)}
            disabled={!isNetworkChangeSupported}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={Network.DEVNET} id="devnet-radio" />
              <Label htmlFor="devnet-radio">Devnet</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={Network.TESTNET} id="testnet-radio" />
              <Label htmlFor="testnet-radio">Testnet</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={Network.MAINNET} id="mainnet-radio" />
              <Label htmlFor="mainnet-radio">Mainnet</Label>
            </div>
          </RadioGroup>
          {!isNetworkChangeSupported && (
            <div className="text-sm text-red-600 dark:text-red-400">
              * {wallet?.name ?? "This wallet"} does not support network change
              requests
            </div>
          )}
        </div> */}
      </CardContent>
    </Card>
  );
}
