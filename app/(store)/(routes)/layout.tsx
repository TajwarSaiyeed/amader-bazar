import {ReactNode} from "react";
import {Metadata} from "next";
import Navbar from "./components/navbar";

const StoreLayout = ({children}: { children: ReactNode }) => {
    return (
        <>
            <Navbar/>
            {children}
        </>
    );
};


export const metadata: Metadata = {
    title: "Online Hut",
    description: "Online Hut",
}

export default StoreLayout;