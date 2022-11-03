/* eslint-disable no-unused-vars */
import { Dispatch, SetStateAction } from "react";

export interface CounterArgs {
    getTime: number,
    setTime: Dispatch<SetStateAction<number>>,
    running: boolean
}