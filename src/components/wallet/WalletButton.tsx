"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState } from "react";
import { WalletDialog } from "./WalletDialog";
import { ConnectedWalletButton } from "./ConnectedWalletButton";
import { Button } from "../ui/button";

export function WalletButton() {
  const [showDialog, setShowDialog] = useState(false);
  const { connected } = useWallet();

  return (
    <WalletDialog
      open={showDialog}
      onOpenChange={setShowDialog}
      onConnectSuccess={(name) => {
        console.log(`Connected to ${name}`);
      }}
      onConnectError={(error) => {
        console.error("Connection error:", error);
      }}
    >
      {connected ? (
        <ConnectedWalletButton />
      ) : (
        <Button variant="outline">
          Connect Wallet
        </Button>
      )}
    </WalletDialog>
  );
} 