import React, {Component} from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { connect } from 'react-redux'
import axios from 'axios'
import { config } from '../../config'
import { tasksSet } from '../actions/tasksSetAction'
import { setAlert } from '../actions/setAlertAction'


const getCardStyle = (isDragging, draggableStyle, item) => {
// do not remove item param - may be useful later
	return ({
		card: {
			userSelect: 'none',
			width: '300px',

			// when dragging
			//background: isDragging ? 'lightgreen' : 'grey',

			// styles we need to apply on draggables
			...draggableStyle
		},
		header: {
			fontWeight: 'bold'
		},
		body: {

		},
		user: {
			position: 'absolute',
			bottom: '3px',
			right: '5px',
		},
	})
}

const getColoumnStyle = () => {
	return {
		title: {
			fontWeight: 'bold'
		},
		body: {

		},
	}
}

const draggableCard = (item, index)=>{
	// Coloring by prior with bootstrap
	let colorPriority = 'black'
	if (item.priority=='high'){
		colorPriority = 'card text-white bg-danger'
	}
	if (item.priority=='medium'){
		colorPriority = 'card text-black bg-warning'
	}
	if (item.priority=='low'){
		colorPriority = 'card text-white bg-success'
	}

	return (
		<Draggable key={item.id} draggableId={item.id} index={index}>
			{(provided, snapshot) => (
				<div className='row mb-2 justify-content-center no-gutters'>
					<div
						// D&D params, do not touch this
						ref={provided.innerRef}
						{...provided.draggableProps}
						{...provided.dragHandleProps}
						// just styles
						className={colorPriority} 
						style={getCardStyle(snapshot.isDragging, provided.draggableProps.style, item).card}
					>

						{/* card */}
						<div 
							className='card-header' 
							style={getCardStyle(snapshot.isDragging, provided.draggableProps.style, item).header}
						>
							{item.title}
						</div>
						<div className='card-body' style={getCardStyle(snapshot.isDragging, provided.draggableProps.style, item).body}>
							<div style={getCardStyle(snapshot.isDragging, provided.draggableProps.style).user}>
								{item.user}
							</div>
							<div>
              Description: 
								<div>
									{item.description}
								</div>
							</div>
						</div>
						{/* card */}
            
					</div>
          
				</div>
			)}
		</Draggable>
	)
}

// Lists styles
const getPlanningListStyle = () => ({
	background: 'rgb(255,255,235)',
	width: '100%',
	height: '100%'
})
  
const getProcessingListStyle = () => ({
	background: 'rgb(184,250,184)',
	width: '100%',
	height: '100%'
})

const getDoneListStyle = () => ({
	background: 'lightblue',
	width: '100%',
	height: '100%'
})



class ScrumDesk extends Component {

	taskChange = async (authData, task) => {
		let result = await axios.post(`${config.beString}${config.beServiceNames.taskChange}`, {authData: authData, task: task})
		if (result.data.msg=='Success'){
			this.props.tasksSet(result.data.newTasks)
		} else {
			this.props.setAlert('GET_TASKS_FAIL')
		}
	}

  onDragEnd = (result) =>{
  	const { source, destination, draggableId } = result
  	// dropped outside the list
  	if (!destination) {
  		return
  	}
  	// dropped on other list
  	if (source.droppableId != destination.droppableId) {
  		const oldTask = this.props.tasks.find((task)=>(task.id===draggableId))
  		if (oldTask.user!=this.props.user) {
  			// wrong user
  			this.props.setAlert('WRONG_USER')
  			return
  		}
  		const newTask = {...oldTask, status: destination.droppableId}
  		this.taskChange({login:this.props.user, passHash: this.props.passHash}, newTask)
  	}
  }

  render() {
  	return (
  		<div 
  			className='container-fluid' 
  			style={{
  				marginRight: '0', 
  				marginLeft: '0',
  				paddingRight: '0',
  				paddingLeft: '0'
  			}}
  		>
  			<div className='row no-gutters justify-content-center' style={{height: '100%'}}>
  				<DragDropContext onDragEnd={this.onDragEnd}>
  					<div className='col-4'>
  						<Droppable droppableId='planning'>
  							{(provided, snapshot) => (
  								<div
  									ref={provided.innerRef}
  									style={getPlanningListStyle(snapshot.isDraggingOver)}
  								>
  									<div className='card-header mb-2' style={getColoumnStyle().title}>
											Planning
  									</div>
  									{/* Coloumns of cards */}
  									{this.props.private // Public/Private desk
  										? this.props.scrumDesk.planning.map((item, index) => (item.user==this.props.user && draggableCard(item, index)) ) 
  										: this.props.scrumDesk.planning.map((item, index) => (draggableCard(item, index)) ) }

  									{provided.placeholder}
  								</div>
  							)}
  						</Droppable>
  					</div>
  					<div className='col-4'>
  						<Droppable droppableId='processing'>
  							{(provided, snapshot) => ( 
  								<div
  									ref={provided.innerRef}
  									style={getProcessingListStyle(snapshot.isDraggingOver)}
  								>
  									<div className='card-header mb-2' style={getColoumnStyle().title}>
											Processing
  									</div>
  									{/* Coloumns of cards */}
  									{this.props.private ? // Public/Private desk
  										this.props.scrumDesk.processing.map((item, index) => (item.user==this.props.user && draggableCard(item, index)) ) 
  										: this.props.scrumDesk.processing.map((item, index) => (draggableCard(item, index)) ) }
                        
  									{provided.placeholder}
  								</div>
  							)}
  						</Droppable>
  					</div>
  					<div className='col-4'>
  						<Droppable droppableId='done'>
  							{(provided, snapshot) => (
  								<div
  									ref={provided.innerRef}
  									style={getDoneListStyle(snapshot.isDraggingOver)}
  								>
  									<div className='card-header mb-2' style={getColoumnStyle().title}>
											Done
  									</div>
  									{/* Coloumns of cards */}
  									{this.props.private ? // Public/Private desk
  										this.props.scrumDesk.done.map((item, index) => (item.user==this.props.user && draggableCard(item, index)) ) 
  										: this.props.scrumDesk.done.map((item, index) => (draggableCard(item, index)) ) }

  									{provided.placeholder}
  								</div>
  							)}
  						</Droppable>
  					</div>
  				</DragDropContext>
  			</div>
  		</div>
  	)
  }
}


const mapStateToProps = (state) => {
	return {
		user: state.user,
		passHash: state.passHash,
		tasks: state.tasks,
		scrumDesk: state.scrumDesk,
		alert: state.alert,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		tasksSet: (tasks) => { dispatch(tasksSet(tasks)) },
		setAlert: (alert) => { dispatch(setAlert(alert)) },
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(ScrumDesk)