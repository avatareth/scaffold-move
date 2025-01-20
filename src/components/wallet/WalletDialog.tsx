"use client";

import { useCallback, useEffect, useState, useMemo } from "react";
import { useWallet, WalletName } from "@aptos-labs/wallet-adapter-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Network } from "@aptos-labs/ts-sdk";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { useAvailableAptosWallets } from "@/lib/wallet-kit/hooks/useAvailableAptosWallets";
import { IWallet } from "@razorlabs/m1-wallet-sdk";
import { PRESET_WALLET } from "@/lib/utils/constants";

interface WalletDialogProps {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onConnectSuccess?: (walletName: string) => void;
  onConnectError?: (error: Error) => void;
}


type WalletItemProps = {
  wallet: IWallet;
  onSelect?: (wallet: IWallet) => void;
};
const WalletItem = (props: WalletItemProps) => {
  const { wallet } = props;
  const [icon, setIcon] = useState<string>("");
  
  useEffect(() => {
    if (!wallet.iconUrl) return;
    setIcon(wallet.iconUrl);
  }, [wallet.iconUrl]);
  
  return (
    <div
      key={wallet.name}
      onClick={() => {
        props.onSelect?.(wallet);
      }}
      className="flex h-[80px] w-full cursor-pointer items-center justify-between rounded-xl bg-white/50 backdrop-blur-sm px-6 py-4 transition-all hover:bg-white/80 hover:shadow-md border border-gray-100 hover:border-purple-200"
    >
      <div className="flex items-center gap-4">
        <Image
          src={icon}
          alt={wallet.name}
          width={36}
          height={36}
          className="rounded-lg"
        />
        <span className="font-medium text-gray-800">{wallet.label ?? wallet.name}</span>
      </div>
      <div className="text-purple-500">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
      </div>
    </div>
  );
};

export function WalletDialog(props: WalletDialogProps) {
  const { connect, connected, network } = useWallet();
  const [selectedWallet, setSelectedWallet] = useState<IWallet | null>(null);
  const { configuredWallets } = useAvailableAptosWallets(PRESET_WALLET);
  const handleSelectWallet = useCallback(
    async (wallet: IWallet) => {
      try {
        setSelectedWallet(wallet);
        await connect(wallet.name as WalletName);
        props.onConnectSuccess?.(wallet.name);
        props.onOpenChange?.(false);
      } catch (error) {
        props.onConnectError?.(error as Error);
        setSelectedWallet(null);
      }
    },
    [connect, props]
  );

  const isMainnet = network?.name === Network.MAINNET;

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogPortal>
        <DialogOverlay className="bg-black/30 backdrop-blur-sm">
          <DialogContent className="sm:max-w-[425px] bg-white/90 backdrop-blur-sm border border-gray-200 shadow-2xl">
            <DialogTitle className="text-2xl font-bold text-center mb-6 bg-blue-500 bg-clip-text text-transparent">
              Connect Wallet
            </DialogTitle>

            {isMainnet && (
              <Alert variant="warning" className="mb-6 border-amber-200 bg-amber-50">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  Some features may not work on Mainnet.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col gap-3">
              {configuredWallets.map((wallet) => (
                <WalletItem
                  key={wallet.name}
                  wallet={wallet}
                  onSelect={() => handleSelectWallet(wallet)}
                />
              ))}
            </div>
          </DialogContent>
        </DialogOverlay>
      </DialogPortal>
    </Dialog>
  );
}
