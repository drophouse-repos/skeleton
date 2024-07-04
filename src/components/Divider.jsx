import './Divider.css'
function Divider({content, style}){
    return(
        <div className='divider' style={style}>{content}</div>
    )
}

export default Divider