import React from "react"
import "./ProgressBar.css"


const Progress = ({done}) => {
	const [style, setStyle] = React.useState({});
	
	return (
		<div className="progress">
			<div className="progress-done" style={style}>
				{done}%
			</div>
		</div>
	)
}

export default function App(){
	return (
	<>
		<h1>Progress Bar</h1>
		<Progress done="60"/>
	</>
	)
}	
