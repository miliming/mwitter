import { dbService, storageService } from "fBase";
import React, { useState } from "react";

const Mweet = ({ mweetObj, isOwner}) => {
    const [editing, setEditing] = useState(false);
    const [newMweet, setNewMweet] = useState(mweetObj.text);
    const onDeleteClick = async () => {
        const ok = window.confirm("삭제 하시겠습니까?");
        if(ok) {
            await dbService.doc(`mweets/${mweetObj.id}`).delete();
            await storageService.refFromURL(mweetObj.attachmentUrl).delete();
        }
    };
    const toggleEditing = () => setEditing((prev) => !prev);
    const onSubmit = async (event) => {
        event.preventDefault();
        await dbService.doc(`mweets/${mweetObj.id}`).update({
            text:newMweet,
        });
        setEditing(false);
    };
    const onChange = (event) => {
        const {
            target: {value}
        } = event;
        setNewMweet(value);
    };

    return(
        <div>
            {editing ? (
                <>
                <form onSubmit={onSubmit}>
                    <input 
                    type="text"
                    placeholder="수정하세요"
                    value={newMweet} required 
                    onChange={onChange}
                    />
                    <input type="submit" value="수정하기"/>
                </form>
                <button onClick={toggleEditing}>취소</button>
                </>
            ) : (
                <>
                    <h4>{mweetObj.text}</h4>
                    {mweetObj.attachmentUrl && (
                        <img src={mweetObj.attachmentUrl} width="50px" height="50px"/>
                    )}
                    {isOwner && (
                    <>
                        <button onClick={onDeleteClick}>삭제</button>
                        <button onClick={toggleEditing}>수정</button>
                    </>
                )}
                 </>
            )}
        </div>
   );   
};
export default Mweet;