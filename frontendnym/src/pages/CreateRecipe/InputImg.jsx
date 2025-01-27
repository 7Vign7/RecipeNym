import React, {useRef, useState} from 'react';

export const InputImg = () => {
    let [drag,setDrag] = useState(false);
    let [postImg, setPostImg] = useState(null);
    let bodyInputRef = useRef();
    const showImg = (e) => {
        setPostImg(e.target.value);
        console.log(postImg);
    }

    function dragStartHandler(e) {
        e.preventDefault();
        setDrag(true);
    }

    function dragLeaveHandler(e) {
        e.preventDefault();
        setDrag(false);
    }

    function onDropHandler(e) {
        e.preventDefault();
        let files = [...e.dataTransfer.files];
        if (files.length > 1 || (files[0].type !== "image/jpeg" && files[0].type !== "image/png" && files[0].type !== "image/jpg")) {
            if (files.length > 1) {
                alert("Можно загрузить только одно изображение")
            }
            alert("Вы попытались загрузить не JPEG,PNG,JPG")
        } else {
            let file = files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                setPostImg(event.target.result);
            };
            reader.readAsDataURL(file);
        }
        setDrag(false);
    }

    const processingImage = (e) => {
        let file = e.target.files[0];
        if (file.type !== "image/jpeg" && file.type !== "image/png" && file.type !== "image/jpg"){
            alert("Вы попытались загрузить не JPEG,PNG,JPG")
        } else {
            const reader = new FileReader();
            reader.onload = (event) => {
                setPostImg(event.target.result);
            };
            reader.readAsDataURL(file);
        }
        setDrag(false);
    }

    const ButtonFileImg = (props)=>{
        return (
            <div>
                <input onChange={processingImage} type={"file"} ref={bodyInputRef} hidden/>
                <button style={props.style} onClick={(e) => {e.preventDefault(); bodyInputRef.current.click()}}>
                    Загрузите фото
                </button>
            </div>
        )
    }
    const TopImg= (props)=>{
        return (
            <div>
                {
                    drag ?
                        <img
                            style={{
                                width: '600px',
                                height: "500px",
                                borderRadius: "20px",
                                transition: ".4s",
                                filter: "blur(10px)"
                            }}
                            src={postImg}
                            onClick={(e) => e.preventDefault()}
                        />
                        :
                        <img
                            style={{
                                width: '600px',
                                height: "500px",
                                borderRadius: "20px",
                                transition: ".4s"
                            }}
                            src={postImg}
                            onClick={(e) => e.preventDefault()}
                        />

                }
                <div style={{display:"flex",justifyContent:"space-around"}}>
                    <ButtonFileImg style={{width:'200px',height:'100%'}}/>
                    <button  style={{width:'200px',height:'100%'}} onClick={(e) => {
                        setPostImg(null)
                    }}>Удалить
                    </button>
                </div>
            </div>

        )
    }

    function DragAndDropBlock(props) {
        let style = false
        let drop = null;
        let DaDText = "Перетащите изображение формата: JPEG,PNG,JPG в эту область"
        if (props.DaD === true) {
            style = true
            drop = (e) => {onDropHandler(e)}
            DaDText = "Отпустите изображение формата: JPEG,PNG,JPG в эту область"
        }
        return (
            <div
                style={{margin: "0"}}
                onDragStart={e => dragStartHandler(e)}
                onDragLeave={e => dragLeaveHandler(e)}
                onDragOver={e => dragStartHandler(e)}
                onDrop={drop}
            >
                {postImg
                    ? <div>
                        <TopImg bluric={style}/>
                    </div>
                    : <div style={{textAlign:"center"}}>
                        {DaDText}
                        <p>или</p>
                        <ButtonFileImg style={{width:'200px',height:'100%'}}/>
                    </div>
                }
            </div>
        )
    }
    const BlockDragDrop = () => {
        return (
            <label style={{
                display:'flex',
                flexDirection:'column',
                alignItems:'center'
            }}>
                {drag?<DragAndDropBlock DaD={true}/>:<DragAndDropBlock/>}
            </label>
        )
    }

    return (
        <form>
            <BlockDragDrop/>
        </form>
    );
};

