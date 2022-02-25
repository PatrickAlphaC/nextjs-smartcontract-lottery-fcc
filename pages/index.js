import Header from "../components/Header"
// import ManualHeader from "../components/ManualHeader"
import LotteryEntrance from "../components/LotteryEntrance"
import LotteryInfo from "../components/LotteryInfo"
import { useMoralis } from "react-moralis"

export default function Home() {
    const { isWeb3Enabled } = useMoralis()

    return (
        <div>
            {/* <ManualHeader /> */}
            <Header />
            {isWeb3Enabled ? (
                <div className="flex flex-row">
                    <LotteryEntrance className="p-8" />
                </div>
            ) : (
                <div>Please connect to a Wallet</div>
            )}
        </div>
    )
}
