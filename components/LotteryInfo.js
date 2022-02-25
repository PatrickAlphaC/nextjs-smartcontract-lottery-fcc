import { useEffect, useState } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { useChain } from "react-moralis"
import { contractAddresses, abi } from "../constants"

export default function LotteryInfo() {
    const { isWeb3enabled } = useMoralis()
    const [numberOfPlayers, setNumberOfPlayers] = useState("0")

    const chainId = parseInt(useChain().chainId)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    const { runContractFunction: getPlayersNumber } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    useEffect(() => {
        const fetchAndSetPlayersNumber = async () => {
            const numPlayer = await getPlayersNumber()
            setNumberOfPlayers(numPlayer.toString())
            console.log(`Updated number of players to ${numPlayer.toString()}`)
        }
        fetchAndSetPlayersNumber()
    }, [isWeb3enabled])

    return <div>{numberOfPlayers}</div>
}
