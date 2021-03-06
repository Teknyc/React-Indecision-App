// babel src/app.js --out-file=public/scripts/app.js --presets=env,react

class IndecisionApp extends React.Component{
    constructor(props){
        console.log("Constructor initiated")
        super();
        this.handleAddOption = this.handleAddOption.bind(this);
        this.handlePick = this.handlePick.bind(this);
        this.handleRemoveAll = this.handleRemoveAll.bind(this);
        this.handleRemoveOption = this.handleRemoveOption.bind(this);
        this.updateOptionsLocalStorage = this.updateOptionsLocalStorage.bind(this);

        this.state = {
            title: "Indecision App",
            subTitle: "Put your life in the hands of a computer",
            options: props.options
        }
    }

    componentDidMount(){
        try {
            const options = JSON.parse(localStorage.getItem("options"));
            if(options){
                this.setState(() => ({ options: options}))
            }
        } catch (error) {
            console.log(error);
        }
    }

    componentDidUpdate(prevProps, prevState){
        // Update localstorage
        if(this.state.options.length != prevState.options.length){
            this.updateOptionsLocalStorage()
        }
        
    }

    updateOptionsLocalStorage(){
        const options = JSON.stringify(this.state.options);
        localStorage.setItem("options", options);
    }

    handleRemoveOption(e){
        this.setState((prevState) => ({ options: prevState.options.filter((option, i) => i != e)}))
    }

    handleRemoveAll() {
        this.setState(() => ({ options: [] }))
    }

    handlePick() {
        const pick = Math.floor(Math.random() * this.state.options.length);
        alert(this.state.options[pick]);
    }

    handleAddOption(option) {
        if(!option){
            return 'Enter a valid value to add';
        } else if(this.state.options.indexOf(option) > -1){
            return 'This value already exists';
        } else {
            this.setState((prevState) => ({ options: prevState.options.concat([option]) }))
        }
    }

    render(){
        return( 
            <div>
                <Header subTitle={ this.state.subTitle } />
                <Action handlePick={ this.handlePick } hasOptions={ this.state.options.length > 0 ? true : false}/>
                <Options handleRemoveOption={ this.handleRemoveOption } handleRemoveAll={ this.handleRemoveAll } options={ this.state.options } />
                <AddOption handleAddOption={ this.handleAddOption } />
            </div>
        )
    }
}

IndecisionApp.defaultProps = {
    options: []
}

const Header = (props) => {
    return(
        <div>
            <h1>{ props.title }</h1>
            { props.subTitle && <h2>{ props.subTitle }</h2>}
        </div>
    )
}

Header.defaultProps = {
    title: "Indecision App"
}

const Action = (props) => {
    return(
        <div>
            <button disabled={ !props.hasOptions } onClick={ props.handlePick }>What should i do?</button>
        </div>
    )
}

const Options = (props) => {
    return (
        <div>
            <button onClick={props.handleRemoveAll }>Remove All</button>
            { props.options.length === 0 && <p>Please add an option to get started</p>}
            { props.options.map((option, i) => <Option key={i} handleRemoveOption={ props.handleRemoveOption } index={i} option={option} />)}
        </div>
    )
}

const Option = (props) => {
    return (
        <div>
            { props.option }
            <button onClick={() => {
                props.handleRemoveOption(props.index)
            }}>remove</button>
        </div>
    )
}

class AddOption extends React.Component {
    constructor(){
        super();

        this.handleAddOption = this.handleAddOption.bind(this);

        this.state = {
            errorMessage: ''
        }
    }

    handleAddOption(e){
        e.preventDefault();

        const option = e.target.elements.option.value.trim();

        const errorMessage = this.props.handleAddOption(option)
        this.setState(() => ({errorMessage}))

        if(!errorMessage){
            e.target.reset();
        }
    }

    render(){
        return (
            <div>
                {this.state.errorMessage && <p>{this.state.errorMessage}</p>}
                <form onSubmit={this.handleAddOption}>
                    <input type="text" name="option"/>
                    <button type="submit">Add option</button>
                </form>
            </div>
        )
    }
}

ReactDOM.render(<IndecisionApp />, document.getElementById("app"))