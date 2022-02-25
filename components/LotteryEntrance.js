import { useWeb3Contract } from "react-moralis"
import { contractAddresses, abi } from "../constants"
import { useChain, useMoralis } from "react-moralis"
import { useEffect, useState } from "react"

export default function LotteryEntrance() {
    const { Moralis, isWeb3Enabled, provider } = useMoralis()
    // These get re-rendered every time due to our connect button!
    const chainId = parseInt(useChain().chainId)
    console.log(`ChainId is ${chainId}`)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const options = { abi, contractAddress: raffleAddress }
    // State hooks for those that
    // https://stackoverflow.com/questions/58252454/react-hooks-using-usestate-vs-just-variables
    const [entranceFee, setEntranceFee] = useState("0")
    const [numberOfPlayers, setNumberOfPlayers] = useState("0")

    const {
        runContractFunction: enterRaffle,
        data: enterTxResponse,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        msgValue: entranceFee,
        params: {},
    })

    const { runContractFunction: getPlayersNumber } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    useEffect(() => {
        async function fetchAndSetEntranceFee() {
            const fee = await Moralis.executeFunction({
                functionName: "getEntranceFee",
                ...options,
            })
            setEntranceFee(fee.toString())
            console.log(`EntranceFee is ${fee.toString()}`)
        }
        fetchAndSetEntranceFee()
    }, [isWeb3Enabled])
    // no list means it'll update everytime anything changes or happens
    // empty list means it'll run once after the initial rendering
    // and dependencies mean it'll run whenever those things in the list change

    // const filter = {
    //     address: raffleAddress,
    //     topics: [
    //         // the name of the event, parnetheses containing the data type of each event, no spaces
    //         utils.id("RaffleEnter(address)"),
    //     ],
    // }

    useEffect(() => {
        provider.on("RaffleEnter", async (event) => {
            console.log("I DID IT?")
        })
    })

    useEffect(() => {
        const fetchAndSetPlayersNumber = async () => {
            const numPlayer = await getPlayersNumber()
            setNumberOfPlayers(numPlayer.toString())
        }
        fetchAndSetPlayersNumber()
    }, [enterTxResponse, isWeb3Enabled])

    return (
        <div className="p-5">
            <h1 className="py-4 px-4 font-bold text-3xl">Lottery</h1>
            {raffleAddress ? (
                <>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        onClick={async () => await enterRaffle()}
                        disabled={isLoading || isFetching}
                    >
                        Enter Raffle
                    </button>
                    <div>The current number of players is: {numberOfPlayers}</div>
                </>
            ) : (
                <div>Please connect to a supported chain </div>
            )}
        </div>
    )
}
