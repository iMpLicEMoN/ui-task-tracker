import React, {Component} from 'react'
import { connect } from 'react-redux'
import { setAlert } from '../actions/setAlertAction'
import { representationChange } from '../actions/representationChangeAction'
import ScrumDesk from './ScrumDesk'
import TaskListFull from './TaskListFull'
import TaskListShort from './TaskListShort'



class MyTasks extends Component {

    handleClick = (event) => {
    	event.preventDefault()
    	this.props.representationChange(event.currentTarget.id)
    }

    render(){
    	let result

    	if (this.props.representation=='scrumDesk') 
    		result = (
    			<div className='MyTasks'>
    				<div className='btn-group btn-group-toggle ml-5 mt-3 mb-3' data-toggle='buttons'>
    					<label className='btn btn-secondary active'>
    						<input type='radio' name='representation' id='scrumDesk' autoComplete='off' onClick={this.handleClick}/> My Desk
    					</label>
    					<label className='btn btn-secondary '>
    						<input type='radio' name='representation' id='short' autoComplete='off' onClick={this.handleClick} /> Short
    					</label>
    					<label className='btn btn-secondary '>
    						<input type='radio' name='representation' id='full' autoComplete='off' onClick={this.handleClick} /> Full
    					</label>
    				</div>
    				<ScrumDesk private={true}/>
    			</div>
    		)

    	if (this.props.representation=='short') 
    		result = (
    			<div className='MyTasks'>
    				<div className='btn-group btn-group-toggle ml-5 mt-3 mb-3' data-toggle='buttons'>
    					<label className='btn btn-secondary'>
    						<input type='radio' name='representation' id='scrumDesk' autoComplete='off' onClick={this.handleClick}/> My Desk
    					</label>
    					<label className='btn btn-secondary active'>
    						<input type='radio' name='representation' id='short' autoComplete='off' onClick={this.handleClick} /> Short
    					</label>
    					<label className='btn btn-secondary '>
    						<input type='radio' name='representation' id='full' autoComplete='off' onClick={this.handleClick} /> Full
    					</label>
    				</div>
    				<TaskListShort />
    			</div>
    		)

    	if (this.props.representation=='full') 
    		result = (
    			<div className='MyTasks'>
    				<div className='btn-group btn-group-toggle ml-5 mt-3 mb-3' data-toggle='buttons'>
    					<label className='btn btn-secondary'>
    						<input type='radio' name='representation' id='scrumDesk' autoComplete='off' onClick={this.handleClick}/> My Desk
    					</label>
    					<label className='btn btn-secondary '>
    						<input type='radio' name='representation' id='short' autoComplete='off' onClick={this.handleClick} /> Short
    					</label>
    					<label className='btn btn-secondary active'>
    						<input type='radio' name='representation' id='full' autoComplete='off' onClick={this.handleClick} /> Full
    					</label>
    				</div>
    				<TaskListFull />
    			</div>
    		)
        
    	return result

    }
}


const mapStateToProps = (state) => {
	return {
		user: state.user,
		alert: state.alert,
		representation: state.representation,
	}
}
  
const mapDispatchToProps = (dispatch) => {
	return {
		setAlert: (alert) => { dispatch(setAlert(alert)) },
		representationChange: (representation) => { dispatch(representationChange(representation)) },
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(MyTasks)