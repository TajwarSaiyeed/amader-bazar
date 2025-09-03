"use client";
import {PuffLoader} from "react-spinners";

const Loading = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center">
            <PuffLoader color={"blue"} size={150}/>
        </div>
    );
};

export default Loading;