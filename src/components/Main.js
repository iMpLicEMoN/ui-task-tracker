import React, {Component} from 'react'
import ScrumDesk from './ScrumDesk'

class Main extends Component {
	render(){
		// Main ScrumDesk with all users tasks
		return <ScrumDesk private={false}/>
	}
}

export default Main