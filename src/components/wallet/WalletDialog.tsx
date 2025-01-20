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
      className="flex h-[100px] w-full cursor-pointer items-center justify-between rounded-[20px] bg-[#F6F5F1] px-[30px] py-[20px] transition-all hover:bg-[#ECEAE3]"
    >
      <Image
        src={icon}
        alt={wallet.name}
        width={40}
        height={40}
        className="rounded-xl"
      />
      <span className="font-medium">{wallet.label ?? wallet.name}</span>
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
        <DialogOverlay>
          <DialogContent className="sm:max-w-[425px]">
            <DialogTitle className="text-xl font-semibold text-center mb-4">
              Connect Wallet
            </DialogTitle>

            {isMainnet && (
              <Alert variant="warning" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  Some features may not work on Mainnet.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col gap-2">
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
