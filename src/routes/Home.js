import { dbService } from "fBase";
import React, { useState } from "react";

const Home = () => {
    const [mweet, setMweet] = useState("");
    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.collection("mweets").add({
            mweet,
            createdAt: Date.now(),
        });
        setMweet("");
    };
    const onChange = (event) => {
        const {
            target: {value},
        } = event;
        setMweet(value);
    };
    return (
        <div>
        <form onSubmit={onSubmit}>
            <input 
            value={mweet} 
            onChange={onChange}
            type="text" placeholder="what's on your mind" maxLength={120}/>
            <input type="submit" value="mweet"/>
        </form>
    </div>
    );
    };
 export default Home;