import Mweet from "components/Mweet";
import { dbService, storageService } from "fBase";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

const Home = ({ userObj }) => {
    const [mweet, setMweet] = useState("");
    const [mweets, setMweets] = useState([]);
    const [attachment, setAttachment] = useState();
    useEffect(() => {
        dbService.collection("mweets").onSnapshot((snapshot) => {
            const mweetArray = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setMweets(mweetArray);
        });
    }, []);
    const onSubmit = async (event) => { // 버튼은 눌러야 submit이 동작..
        event.preventDefault();
        let attachmentUrl = "";
        if (attachment !== "") {
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
            const response = await attachmentRef.putString(attachment, "data_url");
            attachmentUrl = await response.ref.getDownloadURL();
        }
        const mweetObj = {
            text: mweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
        };
        await dbService.collection("mweets").add(mweetObj);
        setMweet("");
        setAttachment("");
    };
    const onChange = (event) => {
        const {
            target: {value},
        } = event;
        setMweet(value);
    };
    const onFileChange = (event) => {
        const {
            target: { files },
        } = event;
        const theFile = files[0];  // 파일 한개만 받을 거임
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget: { result },
            } = finishedEvent;
            setAttachment(result);
        };  
        reader.readAsDataURL(theFile);
    };
    const onClearAttachment = () => setAttachment(null);
    return (
        <div>
        <form onSubmit={onSubmit}> 
            <input 
            value={mweet} 
            onChange={onChange}
            type="text" 
            placeholder="what's on your mind" 
            maxLength={120}
            />
            <input type="file" accept="image/*" onChange={onFileChange}/>
            <input type="submit" value="Mweet"/>
            {attachment && (
                <div>
                    <img src={attachment} width="50px" height="50px"/>
                    <button onClick={onClearAttachment}>이미지 취소</button>
                </div>
                )}
        </form>
        <div>
            {mweets.map((mweet) => (
                <Mweet 
                key={mweet.id} 
                mweetObj={mweet} 
                isOwner={mweet.creatorId === userObj.uid} 
                />
            ))}
        </div>
    </div>
    );
    };
 export default Home;