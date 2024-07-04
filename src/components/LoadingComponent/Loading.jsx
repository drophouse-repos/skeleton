import "./Loading.css"

export const Loading = (props, {children}) => {
    return <div className="w-[100vw] h-[80vh]"><div className="loader-container"><div className="loader">{children}</div></div></div>
}