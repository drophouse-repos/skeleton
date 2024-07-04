import "./InformationTopNav.css"
import { Orgcontext } from "../../context/ApiContext"
import { useContext } from "react"
function InformationTopNav({title}){
    const { orgDetails } = useContext(Orgcontext)
    return (
        <div className="w-full">
            <span className="w-[80%] inline-block text-left text-2xl align-middle" style={{fontFamily : `${orgDetails[0].font}`}}>{title}</span>
            <span className="material-symbols-outlined w-[20%] inline-block text-right align-middle cursor-pointer" onClick={()=> {window.history.back()}}>close</span>
        </div>
    )
}

export default InformationTopNav